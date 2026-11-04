/**
 * Voice Service for Saarthi AI
 * ----------------------------------------------------
 * Full-duplex continuous live conversational voice agent.
 * Handles microphone capture, Web Audio API analysis (input & output),
 * bidirectional WebSocket streaming with Deepgram STT,
 * ElevenLabs TTS playback, client-side VAD, and instant barge-in.
 */

import { CHAT_CONFIG } from './chat-config.js';
import { sendMessage } from './chat-service.js';

export class VoiceService {
  constructor(options = {}) {
    this.wsUrl = options.wsUrl || CHAT_CONFIG.VOICE_WS_URL || 'ws://localhost:8000/api/voice';
    this.ws = null;
    this.mediaStream = null;
    this.mediaRecorder = null;
    this.audioContext = null;
    this.inputAnalyser = null;
    this.outputAnalyser = null;
    this.outputSourceNode = null;
    this.animFrameId = null;

    // Status: 'idle' | 'listening' | 'transcribing' | 'thinking' | 'speaking'
    this.status = 'idle';
    this.isContinuous = true;
    this.isMuted = false;
    this.currentMicVolume = 0;

    // Playback state
    this.currentAudio = null;
    this.audioChunks = [];
    this.isPlaying = false;
    this.lastAnswerText = '';
    this.hasPlayedAudio = false;
    this.speakingStartTime = 0;

    // Fallback Web Speech instance
    this.recognition = null;
    this.isUsingWebSpeechFallback = false;

    // Callbacks
    this.onStatusChange = options.onStatusChange || (() => {});
    this.onTranscript = options.onTranscript || (() => {});
    this.onAnswerChunk = options.onAnswerChunk || (() => {});
    this.onAnswer = options.onAnswer || (() => {});
    this.onError = options.onError || (() => {});
    this.onInterrupted = options.onInterrupted || (() => {});
    this.onVolumeLevel = options.onVolumeLevel || (() => {});
  }

  /**
   * Prime AudioContext on user interaction
   */
  primeAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        if (!this.audioContext || this.audioContext.state === 'closed') {
          this.audioContext = new AudioCtx();
        }
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
      }
    } catch (e) {
      console.warn('[VoiceService] Audio prime notice:', e);
    }
  }

  /**
   * Set status and notify UI (keeps mediaStream alive in continuous mode)
   */
  setStatus(newStatus) {
    this.status = newStatus;
    this.onStatusChange(newStatus);
  }

  /**
   * Connect or retrieve active WebSocket
   */
  async ensureConnection() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return this.ws;
    }

    if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
      return new Promise((resolve, reject) => {
        const onOpen = () => {
          this.ws.removeEventListener('open', onOpen);
          this.ws.removeEventListener('error', onError);
          resolve(this.ws);
        };
        const onError = (e) => {
          this.ws.removeEventListener('open', onOpen);
          this.ws.removeEventListener('error', onError);
          reject(e);
        };
        this.ws.addEventListener('open', onOpen);
        this.ws.addEventListener('error', onError);
      });
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.wsUrl);
      } catch (err) {
        return reject(err);
      }

      this.ws.binaryType = 'arraybuffer';

      this.ws.onopen = () => {
        resolve(this.ws);
      };

      this.ws.onerror = (err) => {
        reject(err);
      };

      this.ws.onclose = () => {
        if (this.status !== 'idle') {
          this.setStatus('idle');
        }
      };

      this.ws.onmessage = (event) => {
        this.handleSocketMessage(event);
      };
    });
  }

  /**
   * Process WebSocket frames
   */
  handleSocketMessage(event) {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch {
      return;
    }

    const type = data.type;

    if (type === 'status') {
      const serverStatus = data.status;
      if (serverStatus === 'ready') {
        if (this.status === 'idle') {
          this.setStatus('idle');
        }
      } else if (serverStatus === 'idle') {
        if (!this.hasPlayedAudio && !this.isPlaying && this.lastAnswerText) {
          this.speakWithSpeechSynthesis(this.lastAnswerText);
        } else if (!this.isPlaying) {
          this.setStatus(this.isContinuous ? 'listening' : 'idle');
        }
      } else {
        this.setStatus(serverStatus);
      }
    } else if (type === 'transcript') {
      this.onTranscript(data.text, Boolean(data.is_final));
    } else if (type === 'answer_chunk') {
      this.lastAnswerText = (this.lastAnswerText || '') + (data.delta || '');
      this.onAnswerChunk(data.delta || '');
    } else if (type === 'answer') {
      this.lastAnswerText = data.text || '';
      this.onAnswer(data.text || '');
    } else if (type === 'audio') {
      this.handleIncomingAudio(data.data, data.streaming);
    } else if (type === 'audio_end') {
      this.finishAudioStream();
    } else if (type === 'interrupted') {
      this.handleInterruption();
    } else if (type === 'error') {
      this.onError(data.message || 'Voice error occurred.');
    }
  }

  /**
   * Decode base64 audio chunks
   */
  handleIncomingAudio(base64Data, isStreaming) {
    if (!base64Data) return;
    try {
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      this.audioChunks.push(bytes);
      if (!isStreaming) {
        this.finishAudioStream();
      }
    } catch (e) {
      console.error('[VoiceService] Audio decode error:', e);
    }
  }

  /**
   * Play ElevenLabs audio and route to output analyser node
   */
  finishAudioStream() {
    if (this.audioChunks.length === 0) {
      if (this.lastAnswerText && !this.hasPlayedAudio) {
        this.speakWithSpeechSynthesis(this.lastAnswerText);
      } else {
        this.setStatus(this.isContinuous ? 'listening' : 'idle');
      }
      return;
    }

    this.stopPlayback();

    const chunks = [...this.audioChunks];
    this.audioChunks = [];

    try {
      const blob = new Blob(chunks, { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(blob);
      this.currentAudio = new Audio(audioUrl);
      this.isPlaying = true;
      this.hasPlayedAudio = true;
      this.speakingStartTime = Date.now();
      this.setStatus('speaking');

      // Connect to outputAnalyser for live visualizer wave data
      if (this.audioContext) {
        try {
          if (!this.outputAnalyser) {
            this.outputAnalyser = this.audioContext.createAnalyser();
            this.outputAnalyser.fftSize = 256;
          }
          const source = this.audioContext.createMediaElementSource(this.currentAudio);
          source.connect(this.outputAnalyser);
          this.outputAnalyser.connect(this.audioContext.destination);
        } catch (e) {
          // Normal playback if source already connected
        }
      }

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({ type: 'client_speaking_start' }));
        } catch (e) {}
      }

      const playPromise = this.currentAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('[VoiceService] HTMLAudio play error, falling back to speech synthesis:', err);
          if (this.lastAnswerText) {
            this.speakWithSpeechSynthesis(this.lastAnswerText);
          } else {
            this.setStatus(this.isContinuous ? 'listening' : 'idle');
          }
        });
      }

      const onDone = () => {
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        this.isPlaying = false;
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          try {
            this.ws.send(JSON.stringify({ type: 'client_speaking_end' }));
          } catch (e) {}
        }
        this.setStatus(this.isContinuous ? 'listening' : 'idle');
      };

      this.currentAudio.onended = onDone;
      this.currentAudio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        this.isPlaying = false;
        if (this.lastAnswerText) {
          this.speakWithSpeechSynthesis(this.lastAnswerText);
        } else {
          onDone();
        }
      };
    } catch (e) {
      console.warn('[VoiceService] Audio playback exception:', e);
      if (this.lastAnswerText) {
        this.speakWithSpeechSynthesis(this.lastAnswerText);
      } else {
        this.setStatus(this.isContinuous ? 'listening' : 'idle');
      }
    }
  }

  /**
   * Browser SpeechSynthesis fallback
   */
  speakWithSpeechSynthesis(text) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.setStatus(this.isContinuous ? 'listening' : 'idle');
      return;
    }

    this.stopPlayback();
    const cleanText = (text || '')
      .replace(/[*_#`~[\]()]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (!cleanText) {
      this.setStatus(this.isContinuous ? 'listening' : 'idle');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('George'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      this.isPlaying = true;
      this.hasPlayedAudio = true;
      this.speakingStartTime = Date.now();
      this.setStatus('speaking');

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({ type: 'client_speaking_start' }));
        } catch (e) {}
      }

      utterance.onend = () => {
        this.isPlaying = false;
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          try {
            this.ws.send(JSON.stringify({ type: 'client_speaking_end' }));
          } catch (e) {}
        }
        this.setStatus(this.isContinuous ? 'listening' : 'idle');
      };

      utterance.onerror = () => {
        this.isPlaying = false;
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          try {
            this.ws.send(JSON.stringify({ type: 'client_speaking_end' }));
          } catch (e) {}
        }
        this.setStatus(this.isContinuous ? 'listening' : 'idle');
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[VoiceService] SpeechSynthesis error:', err);
      this.isPlaying = false;
      this.setStatus(this.isContinuous ? 'listening' : 'idle');
    }
  }

  /**
   * Instantly halt current audio playback (for barge-in)
   */
  stopPlayback() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {}
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    this.isPlaying = false;
    this.audioChunks = [];
  }

  /**
   * Handle barge-in interruption
   */
  handleInterruption() {
    this.stopPlayback();
    this.onInterrupted();
    this.setStatus('listening');
  }

  /**
   * Trigger barge-in: cancel backend generation & cut browser audio
   */
  interrupt() {
    this.stopPlayback();
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: 'interrupt' }));
        this.ws.send(JSON.stringify({ type: 'user_speech_start' }));
      } catch (e) {}
    }
    this.handleInterruption();
  }

  /**
   * Start full-duplex live conversation
   */
  async startListening() {
    this.primeAudio();
    this.lastAnswerText = '';
    this.hasPlayedAudio = false;
    this.audioChunks = [];

    if (this.isPlaying) {
      this.interrupt();
    }

    try {
      await this.ensureConnection();
      this.isUsingWebSpeechFallback = false;
    } catch (err) {
      console.warn('[VoiceService] WebSocket unreachable, using Web Speech API fallback:', err);
      return this.startWebSpeechFallback();
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone audio capture is not supported.');
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (err) {
      console.error('[VoiceService] getUserMedia error:', err);
      this.onError('Microphone permission denied.');
      this.setStatus('idle');
      return false;
    }

    // Connect input analyser node
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        if (!this.audioContext || this.audioContext.state === 'closed') {
          this.audioContext = new AudioCtx();
        }
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
        const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        this.inputAnalyser = this.audioContext.createAnalyser();
        this.inputAnalyser.fftSize = 256;
        source.connect(this.inputAnalyser);
        this.startBargeInMonitor();
      }
    } catch (e) {
      console.warn('[VoiceService] Input analyser setup error:', e);
    }

    let mimeType = 'audio/webm;codecs=opus';
    if (typeof MediaRecorder !== 'undefined') {
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
      }
    }

    try {
      const options = mimeType ? { mimeType } : undefined;
      this.mediaRecorder = new MediaRecorder(this.mediaStream, options);
    } catch (e) {
      this.mediaRecorder = new MediaRecorder(this.mediaStream);
    }

    // Continuous streaming: keep sending 250ms chunks to Deepgram
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0 && !this.isMuted) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          try {
            this.ws.send(event.data);
          } catch (e) {}
        }
      }
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: 'start_stream', mime: mimeType }));
      } catch (e) {}
    }

    this.mediaRecorder.start(250);
    this.setStatus('listening');
    return true;
  }

  /**
   * Continuous volume analysis for real-time barge-in detection & visualizer
   */
  startBargeInMonitor() {
    if (!this.inputAnalyser) return;

    const dataArray = new Uint8Array(this.inputAnalyser.frequencyBinCount);
    let consecutiveSpeechFrames = 0;

    const checkVolume = () => {
      if (!this.inputAnalyser || this.status === 'idle') return;

      this.inputAnalyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      this.currentMicVolume = avg;

      if (this.onVolumeLevel) {
        this.onVolumeLevel(avg, 'input');
      }

      // Real-time client-side VAD barge-in:
      // If Saarthi is speaking and user speaks (volume > 38)
      if (this.isPlaying && this.status === 'speaking') {
        const timeSinceSpeech = Date.now() - this.speakingStartTime;
        if (timeSinceSpeech > 350 && avg > 38) {
          consecutiveSpeechFrames++;
          if (consecutiveSpeechFrames >= 2) {
            console.log('[VoiceService] Client VAD Instant Barge-in! Mic Volume:', avg);
            this.interrupt();
            consecutiveSpeechFrames = 0;
          }
        } else {
          consecutiveSpeechFrames = 0;
        }
      }

      this.animFrameId = requestAnimationFrame(checkVolume);
    };

    this.animFrameId = requestAnimationFrame(checkVolume);
  }

  /**
   * Toggle microphone mute state
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !this.isMuted;
      });
    }
    return this.isMuted;
  }

  /**
   * Stop listening and close session
   */
  stopListening() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {}
    }
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: 'stop_stream' }));
      } catch (e) {}
    }
  }

  /**
   * Clean up all audio resources
   */
  cleanupAudio() {
    this.stopPlayback();
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {}
    }
    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach((track) => track.stop());
      } catch (e) {}
      this.mediaStream = null;
    }
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {}
      this.recognition = null;
    }
    this.setStatus('idle');
  }

  /**
   * Web Speech fallback implementation
   */
  startWebSpeechFallback() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.onError('Voice assistant is not supported in this browser.');
      this.setStatus('idle');
      return false;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.isUsingWebSpeechFallback = true;
      this.setStatus('listening');

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          this.onTranscript(transcript, false);
        }
      };

      this.recognition.onerror = () => {
        this.setStatus('idle');
      };

      this.recognition.start();
      return true;
    } catch (e) {
      this.onError('Unable to start speech recognition.');
      this.setStatus('idle');
      return false;
    }
  }
}
