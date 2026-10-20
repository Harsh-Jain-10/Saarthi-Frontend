/**
 * Voice Service for Saarthi AI
 * ----------------------------------------------------
 * Handles browser microphone capture, Web Audio API analysis,
 * bidirectional WebSocket audio streaming to the backend,
 * assistant TTS audio playback, and instant barge-in interruption.
 */

import { CHAT_CONFIG } from './chat-config.js';

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

    // Callbacks
    this.onStatusChange = options.onStatusChange || (() => {});
    this.onTranscript = options.onTranscript || (() => {});
    this.onAnswerChunk = options.onAnswerChunk || (() => {});
    this.onAnswer = options.onAnswer || (() => {});
    this.onError = options.onError || (() => {});
    this.onInterrupted = options.onInterrupted || (() => {});
  }

  /**
   * Set status and notify UI
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
        this.onError('Unable to connect to the voice server at ' + this.wsUrl);
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
      } else {
        this.setStatus(serverStatus);
      }
    } else if (type === 'transcript') {
      this.onTranscript(data.text, Boolean(data.is_final));
    } else if (type === 'answer_chunk') {
      this.onAnswerChunk(data.delta || '');
    } else if (type === 'answer') {
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
   * Play accumulated audio chunks
   */
  finishAudioStream() {
    if (this.audioChunks.length === 0) return;

    // Halt any previous playback
    this.stopPlayback();

    const blob = new Blob(this.audioChunks, { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(blob);
    this.currentAudio = new Audio(audioUrl);
    this.isPlaying = true;
    this.setStatus('speaking');

    this.currentAudio.play().catch((err) => {
      console.warn('[VoiceService] Autoplay blocked or error:', err);
      this.setStatus('idle');
    });

    this.currentAudio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      this.currentAudio = null;
      this.isPlaying = false;
      this.audioChunks = [];
      this.setStatus('idle');
    };
  }

  /**
   * Instantly halt current audio playback (for barge-in)
   */
  stopPlayback() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
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
      this.ws.send(JSON.stringify({ type: 'interrupt' }));
    }
    this.handleInterruption();
  }

  /**
   * Start capturing microphone audio and streaming over WebSocket
   */
  async startListening() {
    // 1. If currently speaking, stop playback immediately
    if (this.isPlaying) {
      this.interrupt();
    }

    // 2. Ensure WebSocket connection
    try {
      await this.ensureConnection();
    } catch (err) {
      this.onError('Could not establish voice connection with backend.');
      return false;
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
        this.audioContext = new AudioCtx();
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

    // Stream binary audio chunks over WebSocket every 250ms
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(event.data);
        }
      }
    };

    // Send start signal
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'start_stream', mime: mimeType }));
    }

    // Start recording with 250ms slice interval
    this.mediaRecorder.start(250);
    this.setStatus('listening');
    return true;
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

      // When assistant is speaking or thinking and user speaks loudly
      if ((this.status === 'speaking' || this.status === 'thinking' || this.isPlaying) && avg > 30) {
        consecutiveActiveFrames++;
        if (consecutiveActiveFrames >= 3) {
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

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'stop_stream' }));
    }

    if (this.status === 'listening') {
      this.setStatus('idle');
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
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }
    this.setStatus('idle');
  }
}
