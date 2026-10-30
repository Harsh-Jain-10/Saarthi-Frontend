/**
 * Voice Service for Saarthi AI
 * ----------------------------------------------------
 * Handles browser microphone capture, Web Audio API analysis,
 * bidirectional WebSocket audio streaming to the backend,
 * assistant TTS audio playback (Deepgram Aura TTS with Web Speech API fallback),
 * and instant barge-in interruption.
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
    this.analyser = null;
    this.animFrameId = null;

    // Status: 'idle' | 'listening' | 'transcribing' | 'thinking' | 'speaking'
    this.status = 'idle';

    // Playback state
    this.currentAudio = null;
    this.audioChunks = [];
    this.isPlaying = false;
    this.lastAnswerText = '';
    this.hasPlayedAudio = false;
    this.speakingStartTime = 0;

    // Fallback SpeechRecognition instance if WebSocket is offline
    this.recognition = null;
    this.isUsingWebSpeechFallback = false;

    // Callbacks
    this.onStatusChange = options.onStatusChange || (() => {});
    this.onTranscript = options.onTranscript || (() => {});
    this.onAnswerChunk = options.onAnswerChunk || (() => {});
    this.onAnswer = options.onAnswer || (() => {});
    this.onError = options.onError || (() => {});
    this.onInterrupted = options.onInterrupted || (() => {});
  }

  /**
   * Prime audio context and speech synthesis during user gesture (click)
   * to guarantee autoplay permissions are unlocked across all browsers.
   */
  primeAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        if (!this.audioContext) {
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
   * Set status and notify UI
   */
  setStatus(newStatus) {
    this.status = newStatus;
    if (newStatus === 'thinking' || newStatus === 'speaking') {
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
    }
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
        this.cleanupAudio();
        this.setStatus('idle');
      };

      this.ws.onmessage = (event) => {
        this.handleSocketMessage(event);
      };
    });
  }

  /**
   * Process incoming WebSocket message from backend
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
        // If server transitions to idle and we haven't played audio yet but have an answer
        if (!this.hasPlayedAudio && !this.isPlaying && this.lastAnswerText) {
          this.speakWithSpeechSynthesis(this.lastAnswerText);
        } else if (!this.isPlaying) {
          this.setStatus('idle');
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
      // Received base64 audio chunk from Deepgram Aura TTS
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
   * Handle incoming assistant speech audio bytes
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
   * Play accumulated audio chunks (or fallback to Web Speech API TTS)
   */
  finishAudioStream() {
    if (this.audioChunks.length === 0) {
      if (this.lastAnswerText && !this.hasPlayedAudio) {
        this.speakWithSpeechSynthesis(this.lastAnswerText);
      } else {
        this.setStatus('idle');
      }
      return;
    }

    // Halt any previous playback
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

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({ type: 'client_speaking_start' }));
        } catch (e) {}
      }

      const playPromise = this.currentAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('[VoiceService] Audio element play error, falling back to Web Speech API:', err);
          if (this.lastAnswerText) {
            this.speakWithSpeechSynthesis(this.lastAnswerText);
          } else {
            this.setStatus('idle');
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
        this.setStatus('idle');
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
      console.warn('[VoiceService] Audio playback exception, falling back to speech synthesis:', e);
      if (this.lastAnswerText) {
        this.speakWithSpeechSynthesis(this.lastAnswerText);
      } else {
        this.setStatus('idle');
      }
    }
  }

  /**
   * Browser Web Speech API fallback for Text-to-Speech
   * Guarantees spoken voice output even if Deepgram audio stream fails.
   */
  speakWithSpeechSynthesis(text) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.setStatus('idle');
      return;
    }

    this.stopPlayback();

    const cleanText = (text || '')
      .replace(/[*_#`~[\]()]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (!cleanText) {
      this.setStatus('idle');
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Female') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Jenny'))
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
        this.setStatus('idle');
      };

      utterance.onerror = (e) => {
        console.warn('[VoiceService] SpeechSynthesis utterance ended with error:', e);
        this.isPlaying = false;
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          try {
            this.ws.send(JSON.stringify({ type: 'client_speaking_end' }));
          } catch (e) {}
        }
        this.setStatus('idle');
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[VoiceService] SpeechSynthesis execution error:', err);
      this.isPlaying = false;
      this.setStatus('idle');
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
   * Handle server or client-side interruption
   */
  handleInterruption() {
    this.stopPlayback();
    this.onInterrupted();
    this.setStatus(this.mediaRecorder && this.mediaRecorder.state === 'recording' ? 'listening' : 'idle');
  }

  /**
   * Trigger barge-in: cancel backend generation & cut browser audio
   */
  interrupt() {
    this.stopPlayback();
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: 'interrupt' }));
      } catch (e) {}
    }
    this.handleInterruption();
  }

  /**
   * Start capturing microphone audio and streaming over WebSocket
   */
  async startListening() {
    this.primeAudio();
    this.lastAnswerText = '';
    this.hasPlayedAudio = false;
    this.audioChunks = [];

    // 1. If currently speaking, stop playback immediately
    if (this.isPlaying) {
      this.interrupt();
    }

    // 2. Try WebSocket connection first; fallback to browser SpeechRecognition if unreachable
    let connected = false;
    try {
      await this.ensureConnection();
      connected = true;
      this.isUsingWebSpeechFallback = false;
    } catch (err) {
      console.warn('[VoiceService] Voice WebSocket unreachable, falling back to Web Speech API:', err);
      return this.startWebSpeechFallback();
    }

    // 3. Request user microphone
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone audio capture is not supported by your browser.');
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
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        this.onError('Microphone access was denied. Please allow microphone permissions in your browser.');
      } else {
        this.onError('Microphone error: ' + (err.message || 'Unable to access microphone.'));
      }
      this.setStatus('idle');
      return false;
    }

    // 4. Set up Web Audio API analyzer for client-side barge-in volume detection
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
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        source.connect(this.analyser);
        this.startBargeInMonitor();
      }
    } catch (e) {
      console.warn('[VoiceService] Web Audio analyser setup failed:', e);
    }

    // 5. Setup MediaRecorder with standard supported formats
    let mimeType = 'audio/webm;codecs=opus';
    if (typeof MediaRecorder !== 'undefined') {
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else {
          mimeType = '';
        }
      }
    }

    try {
      const options = mimeType ? { mimeType } : undefined;
      this.mediaRecorder = new MediaRecorder(this.mediaStream, options);
    } catch (e) {
      this.mediaRecorder = new MediaRecorder(this.mediaStream);
    }

    // Stream binary audio chunks over WebSocket every 250ms (only while listening and not speaking)
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0 && !this.isPlaying && this.status === 'listening') {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          try {
            this.ws.send(event.data);
          } catch (e) {}
        }
      }
    };

    // Send start signal
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: 'start_stream', mime: mimeType }));
      } catch (e) {}
    }

    // Start recording with 250ms slice interval
    this.mediaRecorder.start(250);
    this.setStatus('listening');
    return true;
  }

  /**
   * Browser SpeechRecognition fallback when backend WebSocket is unavailable
   */
  startWebSpeechFallback() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.onError('Voice assistant service is currently unavailable.');
      this.setStatus('idle');
      return false;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.isUsingWebSpeechFallback = true;
      this.setStatus('listening');

      let finalTranscript = '';

      this.recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        const text = finalTranscript || interim;
        this.onTranscript(text, Boolean(finalTranscript));
      };

      this.recognition.onerror = (event) => {
        console.warn('[VoiceService] SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed') {
          this.onError('Microphone permission denied.');
        }
        this.setStatus('idle');
      };

      this.recognition.onend = async () => {
        if (finalTranscript) {
          this.setStatus('thinking');
          try {
            const resp = await sendMessage(finalTranscript);
            const answer = resp.answer || 'Thank you for your question.';
            this.lastAnswerText = answer;
            this.onAnswer(answer);
            this.speakWithSpeechSynthesis(answer);
          } catch (e) {
            this.onError('Could not process voice request.');
            this.setStatus('idle');
          }
        } else {
          this.setStatus('idle');
        }
      };

      this.recognition.start();
      return true;
    } catch (e) {
      console.warn('[VoiceService] SpeechRecognition start failed:', e);
      this.onError('Unable to start speech recognition.');
      this.setStatus('idle');
      return false;
    }
  }

  /**
   * Continuous volume analysis for real-time barge-in detection
   */
  startBargeInMonitor() {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    let consecutiveActiveFrames = 0;

    const checkVolume = () => {
      if (!this.analyser || this.status === 'idle') return;

      this.analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;

      // Only allow voice barge-in if the bot has been speaking for at least 1.2s
      // and volume is above 60 to prevent speaker self-feedback from triggering false interrupts.
      const timeSinceSpeech = Date.now() - this.speakingStartTime;
      if (this.isPlaying && this.status === 'speaking' && timeSinceSpeech > 1200 && avg > 60) {
        consecutiveActiveFrames++;
        if (consecutiveActiveFrames >= 4) {
          // Barge-in detected!
          this.interrupt();
          consecutiveActiveFrames = 0;
        }
      } else {
        consecutiveActiveFrames = 0;
      }

      this.animFrameId = requestAnimationFrame(checkVolume);
    };

    this.animFrameId = requestAnimationFrame(checkVolume);
  }

  /**
   * Stop capturing microphone audio
   */
  stopListening() {
    if (this.isUsingWebSpeechFallback && this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.recognition = null;
      return;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {}
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: 'stop_stream' }));
      } catch (e) {}
    }

    if (this.status === 'listening') {
      this.setStatus('thinking');
    }
  }

  /**
   * Clean up all audio resources
   */
  cleanupAudio() {
    this.stopPlayback();
    this.stopListening();
  }

  /**
   * Disconnect completely
   */
  disconnect() {
    this.cleanupAudio();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }
    this.setStatus('idle');
  }
}
