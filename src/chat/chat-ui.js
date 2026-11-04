import { CHAT_CONFIG } from './chat-config.js';
import { sendMessage } from './chat-service.js';
import { VoiceService } from './voice-service.js';

export function initChat() {
  const isEnabled = Boolean(
    (typeof window !== 'undefined' && window.SRMUH_CHAT_CONFIG?.CHAT_ENABLED) ??
    CHAT_CONFIG.CHAT_ENABLED
  );

  const sessionId = 'srmuh-session-' + Math.random().toString(36).substring(2, 9);

  // Inject Chat DOM into body
  const container = document.createElement('div');
  container.className = 'srmuh-chat-root';
  container.innerHTML = `
    <!-- Launcher Button -->
    <div class="srmuh-chat-launcher" id="srmuh-chat-launcher" role="button" tabindex="0" aria-label="Open SRMUH Talk to us chat assistant" aria-haspopup="dialog" aria-expanded="false">
      <div class="srmuh-avatar-wrapper">
        <span class="srmuh-avatar-badge" aria-hidden="true"></span>
        <div class="srmuh-avatar-circle">
          <!-- Robot with headset SVG -->
          <svg viewBox="0 0 48 48" width="34" height="34" fill="none" stroke="currentColor">
            <!-- Headset arch -->
            <path d="M10 24c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
            <!-- Headset ear pieces -->
            <rect x="7" y="21" width="5" height="9" rx="2.5" fill="#F9A62F"/>
            <rect x="36" y="21" width="5" height="9" rx="2.5" fill="#F9A62F"/>
            <!-- Robot head -->
            <rect x="13" y="16" width="22" height="18" rx="5" fill="#ffffff"/>
            <!-- Antenna -->
            <line x1="24" y1="12" x2="24" y2="16" stroke="#ffffff" stroke-width="2"/>
            <circle cx="24" cy="11" r="2" fill="#F26437"/>
            <!-- Eyes -->
            <circle cx="19" cy="23" r="2.2" fill="#003A9B"/>
            <circle cx="29" cy="23" r="2.2" fill="#003A9B"/>
            <!-- Smile -->
            <path d="M20 28c1.2 1.2 2.8 1.8 4 1.8s2.8-.6 4-1.8" stroke="#003A9B" stroke-width="1.8" stroke-linecap="round"/>
            <!-- Headset mic -->
            <path d="M10 28v2c0 2 1.5 3 4 3h3" stroke="#F9A62F" stroke-width="2" stroke-linecap="round"/>
            <circle cx="21" cy="33" r="1.5" fill="#F26437"/>
          </svg>
        </div>
      </div>
      <div class="srmuh-talk-pill">Talk to us</div>
    </div>

    <!-- Chat Panel Dialog -->
    <div class="srmuh-chat-dialog" id="srmuh-chat-dialog" role="dialog" aria-modal="true" aria-labelledby="srmuh-chat-title" hidden>
      <div class="srmuh-chat-header">
        <div class="srmuh-chat-header-info">
          <div class="srmuh-chat-header-avatar">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="4" y="6" width="16" height="14" rx="3" fill="#ffffff" stroke="#003A9B"/>
              <circle cx="9" cy="12" r="1.5" fill="#003A9B"/>
              <circle cx="15" cy="12" r="1.5" fill="#003A9B"/>
              <path d="M9 16c1 1 2 1.2 3 1.2s2-.2 3-1.2" stroke="#003A9B" stroke-linecap="round"/>
            </svg>
          </div>
          <div>
            <h2 id="srmuh-chat-title" class="srmuh-chat-title">${CHAT_CONFIG.BOT_NAME}</h2>
            <span class="srmuh-chat-status">${isEnabled ? '● Assistant enabled · live service required' : '○ Standby Mode'}</span>
          </div>
        </div>
        <button type="button" class="srmuh-chat-close-btn" id="srmuh-chat-close" aria-label="Close chat window">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="srmuh-chat-body" id="srmuh-chat-body">
        <div class="srmuh-message-bubble assistant">
          ${isEnabled ? CHAT_CONFIG.ENABLED_GREETING : CHAT_CONFIG.DISABLED_GREETING}
        </div>
      </div>

      <!-- Real-time Voice Status Bar -->
      <div class="srmuh-voice-bar" id="srmuh-voice-bar" hidden>
        <div class="srmuh-voice-indicator">
          <span class="srmuh-voice-dot"></span>
          <span class="srmuh-voice-status-text" id="srmuh-voice-status-text">Listening...</span>
        </div>
        <button type="button" class="srmuh-voice-cancel-btn" id="srmuh-voice-cancel" aria-label="Cancel voice mode" title="Cancel voice">✕</button>
      </div>

      <form class="srmuh-chat-footer" id="srmuh-chat-form">
        <input 
          type="text" 
          id="srmuh-chat-input" 
          class="srmuh-chat-input" 
          placeholder="${isEnabled ? CHAT_CONFIG.ENABLED_PLACEHOLDER : CHAT_CONFIG.DISABLED_PLACEHOLDER}" 
          ${isEnabled ? '' : 'disabled'}
          autocomplete="off"
          aria-label="Your query"
        />
        <!-- Microphone Button for Browser Voice Chat -->
        <button 
          type="button" 
          id="srmuh-chat-mic" 
          class="srmuh-chat-mic-btn" 
          ${isEnabled ? '' : 'disabled'}
          aria-label="Voice conversation"
          title="Click to speak (Real-time voice chat)"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        </button>
        <button 
          type="submit" 
          id="srmuh-chat-send" 
          class="srmuh-chat-send-btn" 
          ${isEnabled ? '' : 'disabled'}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>

      <!-- Full-Duplex Live Voice Experience Overlay (ChatGPT Voice Style) -->
      <div class="srmuh-live-overlay" id="srmuh-live-overlay" hidden>
        <!-- Top bar -->
        <div class="srmuh-live-header">
          <div class="srmuh-live-title-wrap">
            <span class="srmuh-live-badge"><span class="srmuh-live-pulse-dot"></span> LIVE</span>
            <span class="srmuh-live-title">Saarthi Voice</span>
          </div>
          <button type="button" class="srmuh-live-close-btn" id="srmuh-live-minimize" title="Switch to text view" aria-label="Minimize voice view">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Center Canvas Visualizer -->
        <div class="srmuh-live-visualizer-container">
          <canvas id="srmuh-voice-canvas" class="srmuh-voice-canvas"></canvas>
          <div class="srmuh-live-status-pill" id="srmuh-live-status-pill">Listening...</div>
        </div>

        <!-- Live Subtitles / Transcript Box -->
        <div class="srmuh-live-transcript-box" id="srmuh-live-transcript-box">
          <p class="srmuh-live-transcript-text" id="srmuh-live-transcript-text">Speak naturally, I'm listening...</p>
        </div>

        <!-- Bottom Controls -->
        <div class="srmuh-live-controls">
          <button type="button" class="srmuh-live-ctrl-btn mute" id="srmuh-live-mute" title="Mute/Unmute Mic" aria-label="Toggle mute">
            <svg id="srmuh-mic-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </button>
          <button type="button" class="srmuh-live-ctrl-btn interrupt" id="srmuh-live-interrupt" title="Interrupt Saarthi" aria-label="Interrupt">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <rect x="5" y="4" width="4" height="16" rx="1"></rect>
              <rect x="15" y="4" width="4" height="16" rx="1"></rect>
            </svg>
          </button>
          <button type="button" class="srmuh-live-ctrl-btn hangup" id="srmuh-live-end" title="End Voice Session" aria-label="End session">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M4 15s3-4 8-4 8 4 8 4"></path>
              <line x1="3" y1="19" x2="21" y2="5" stroke="#FFFFFF"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  const launcher = document.getElementById('srmuh-chat-launcher');
  const dialog = document.getElementById('srmuh-chat-dialog');
  const closeBtn = document.getElementById('srmuh-chat-close');
  const chatBody = document.getElementById('srmuh-chat-body');
  const chatForm = document.getElementById('srmuh-chat-form');
  const chatInput = document.getElementById('srmuh-chat-input');
  const sendBtn = document.getElementById('srmuh-chat-send');
  const micBtn = document.getElementById('srmuh-chat-mic');
  const voiceBar = document.getElementById('srmuh-voice-bar');
  const voiceStatusText = document.getElementById('srmuh-voice-status-text');
  const voiceCancelBtn = document.getElementById('srmuh-voice-cancel');

  // Track active message bubble elements during voice stream
  let interimUserBubble = null;
  let activeAssistantBubble = null;
  let typingIndicator = null;

  // Live Voice Overlay DOM Elements
  const liveOverlay = document.getElementById('srmuh-live-overlay');
  const liveMinimizeBtn = document.getElementById('srmuh-live-minimize');
  const liveStatusPill = document.getElementById('srmuh-live-status-pill');
  const liveTranscriptText = document.getElementById('srmuh-live-transcript-text');
  const liveMuteBtn = document.getElementById('srmuh-live-mute');
  const liveInterruptBtn = document.getElementById('srmuh-live-interrupt');
  const liveEndBtn = document.getElementById('srmuh-live-end');
  const voiceCanvas = document.getElementById('srmuh-voice-canvas');

  // HTML5 Canvas Wave Visualizer (ChatGPT Voice Style)
  class CanvasWaveVisualizer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas ? canvas.getContext('2d') : null;
      this.animId = null;
      this.voiceService = null;
      this.phase = 0;
      this.mode = 'idle';
      this.smoothVol = 0;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.width = rect.width || 320;
      this.height = rect.height || 200;
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      if (this.ctx) {
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }

    setService(vs) {
      this.voiceService = vs;
    }

    setMode(mode) {
      this.mode = mode;
    }

    start() {
      if (this.animId) cancelAnimationFrame(this.animId);
      this.resize();
      const loop = () => {
        this.render();
        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    }

    stop() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }
    }

    render() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);
      this.phase += 0.05;

      let micVol = 0;
      let outVol = 0;

      if (this.voiceService) {
        if (this.voiceService.inputAnalyser) {
          const inputData = new Uint8Array(this.voiceService.inputAnalyser.frequencyBinCount);
          this.voiceService.inputAnalyser.getByteFrequencyData(inputData);
          let s = 0;
          for (let i = 0; i < inputData.length; i++) s += inputData[i];
          micVol = s / inputData.length;
        }
        if (this.voiceService.outputAnalyser && this.voiceService.isPlaying) {
          const outputData = new Uint8Array(this.voiceService.outputAnalyser.frequencyBinCount);
          this.voiceService.outputAnalyser.getByteFrequencyData(outputData);
          let s = 0;
          for (let i = 0; i < outputData.length; i++) s += outputData[i];
          outVol = s / outputData.length;
        }
      }

      const isSpeaking = this.mode === 'speaking' || outVol > 5;
      const isUserSpeaking = this.mode === 'listening' && micVol > 18;

      const targetVol = isSpeaking ? outVol : (isUserSpeaking ? micVol : 6);
      this.smoothVol += (targetVol - this.smoothVol) * 0.18;

      // Central glowing orb
      const baseRadius = 36 + Math.min(this.smoothVol * 0.85, 45);
      const pulse = Math.sin(this.phase * 1.5) * 4;
      const r = Math.max(14, baseRadius + pulse);

      const grad = ctx.createRadialGradient(w / 2, cy, 4, w / 2, cy, r * 1.6);
      if (isSpeaking) {
        grad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
        grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.22)');
        grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      } else if (isUserSpeaking) {
        grad.addColorStop(0, 'rgba(242, 100, 55, 0.55)');
        grad.addColorStop(0.5, 'rgba(239, 68, 68, 0.22)');
        grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      } else if (this.mode === 'thinking') {
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.5)');
        grad.addColorStop(0.5, 'rgba(99, 102, 241, 0.2)');
        grad.addColorStop(1, 'rgba(99, 102, 241, 0)');
      } else {
        grad.addColorStop(0, 'rgba(13, 78, 185, 0.4)');
        grad.addColorStop(0.6, 'rgba(0, 58, 155, 0.15)');
        grad.addColorStop(1, 'rgba(0, 58, 155, 0)');
      }

      ctx.save();
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(w / 2, cy, r * 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Fluid sinusoidal harmonic waves
      const waveCount = 3;
      const colors = isSpeaking
        ? ['rgba(251, 191, 36, 0.85)', 'rgba(56, 189, 248, 0.75)', 'rgba(249, 115, 22, 0.65)']
        : isUserSpeaking
        ? ['rgba(242, 100, 55, 0.9)', 'rgba(239, 68, 68, 0.75)', 'rgba(251, 146, 60, 0.65)']
        : ['rgba(59, 130, 246, 0.75)', 'rgba(99, 102, 241, 0.6)', 'rgba(147, 197, 253, 0.4)'];

      for (let k = 0; k < waveCount; k++) {
        ctx.beginPath();
        ctx.lineWidth = 2.5 - k * 0.5;
        ctx.strokeStyle = colors[k % colors.length];

        const freqMultiplier = 0.015 + k * 0.006;
        const phaseOffset = this.phase * (1.2 + k * 0.4);
        const amp = Math.max(6, (this.smoothVol * 0.95 + 8) * (1 - k * 0.2));

        for (let x = 0; x <= w; x += 3) {
          const envelope = Math.sin((x / w) * Math.PI);
          const y = cy + Math.sin(x * freqMultiplier + phaseOffset) * amp * envelope;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  }

  const visualizer = new CanvasWaveVisualizer(voiceCanvas);

  function showTypingIndicator() {
    if (!typingIndicator) {
      typingIndicator = document.createElement('div');
      typingIndicator.className = 'srmuh-message-bubble assistant typing';
      typingIndicator.innerHTML = `
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      `;
      chatBody.appendChild(typingIndicator);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }

  function removeTypingIndicator() {
    if (typingIndicator) {
      typingIndicator.remove();
      typingIndicator = null;
    }
  }

  function appendSources(bubble, sources) {
    const validSources = (Array.isArray(sources) ? sources : []).map(source => {
      const url = typeof source === 'string' ? source : source?.url || source?.href;
      const label = typeof source === 'object' ? source.title || source.label : '';
      if (typeof url !== 'string' || !(/^(https?:\/\/|#page\/[a-z0-9-]+$)/i).test(url)) return null;
      const isInternal = url.startsWith('#page/');
      let text = label || (isInternal ? ({'#page/programmes':'Programme catalogue','#page/fees':'Tuition fees'}[url] || 'Open page') : 'Official university source');
      if (!label && !isInternal) {
        try { text = new URL(url).hostname.replace(/^www\./, ''); } catch { /* use generic */ }
      }
      return { url, text, isInternal };
    }).filter(Boolean);
    if (!validSources.length) return;

    const list = document.createElement('div');
    list.className = 'srmuh-message-sources';
    const label = document.createElement('span');
    label.textContent = 'Sources';
    list.appendChild(label);
    validSources.forEach(source => {
      const link = document.createElement('a');
      link.href = source.url;
      link.textContent = source.text;
      if (source.isInternal) link.dataset.route = source.url.slice('#page/'.length);
      else {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      list.appendChild(link);
    });
    bubble.appendChild(list);
  }

  // Initialize Real-time Full-Duplex Voice Service
  const voiceService = new VoiceService({
    onStatusChange: (status) => {
      micBtn.classList.remove('is-recording', 'is-speaking', 'is-thinking');
      if (liveStatusPill) {
        liveStatusPill.className = 'srmuh-live-status-pill';
      }
      visualizer.setMode(status);

      if (status === 'listening') {
        voiceBar.hidden = false;
        voiceStatusText.textContent = 'Listening continuously...';
        micBtn.classList.add('is-recording');
        if (liveStatusPill) {
          liveStatusPill.textContent = 'Listening... Speak now';
        }
      } else if (status === 'transcribing') {
        voiceBar.hidden = false;
        voiceStatusText.textContent = 'Transcribing your speech...';
        micBtn.classList.add('is-recording');
        if (liveStatusPill) {
          liveStatusPill.textContent = 'Processing speech...';
        }
      } else if (status === 'thinking') {
        voiceBar.hidden = false;
        voiceStatusText.textContent = 'Saarthi is thinking...';
        micBtn.classList.add('is-thinking');
        if (liveStatusPill) {
          liveStatusPill.classList.add('is-thinking');
          liveStatusPill.textContent = 'Saarthi is thinking...';
        }
      } else if (status === 'speaking') {
        voiceBar.hidden = false;
        voiceStatusText.textContent = 'Saarthi is speaking... (Speak to interrupt)';
        micBtn.classList.add('is-speaking');
        if (liveStatusPill) {
          liveStatusPill.classList.add('is-speaking');
          liveStatusPill.textContent = 'Saarthi is speaking';
        }
      } else {
        voiceBar.hidden = true;
        if (liveStatusPill) {
          liveStatusPill.textContent = 'Ready';
        }
      }
    },

    onTranscript: (text, isFinal) => {
      if (!text) return;
      if (liveTranscriptText) {
        liveTranscriptText.className = 'srmuh-live-transcript-text is-user';
        liveTranscriptText.textContent = `"${text}"`;
      }
      if (liveStatusPill && voiceService.status === 'listening') {
        liveStatusPill.className = 'srmuh-live-status-pill is-user-speaking';
        liveStatusPill.textContent = 'Hearing you speak...';
      }

      if (!interimUserBubble) {
        interimUserBubble = document.createElement('div');
        interimUserBubble.className = 'srmuh-message-bubble user is-interim';
        chatBody.appendChild(interimUserBubble);
      }
      interimUserBubble.textContent = text;
      chatBody.scrollTop = chatBody.scrollHeight;

      if (isFinal) {
        interimUserBubble.classList.remove('is-interim');
        interimUserBubble = null;
      }
    },

    onAnswerChunk: (delta) => {
      removeTypingIndicator();
      if (!activeAssistantBubble) {
        activeAssistantBubble = document.createElement('div');
        activeAssistantBubble.className = 'srmuh-message-bubble assistant';
        chatBody.appendChild(activeAssistantBubble);
      }
      activeAssistantBubble.textContent += delta;
      chatBody.scrollTop = chatBody.scrollHeight;

      if (liveTranscriptText) {
        liveTranscriptText.className = 'srmuh-live-transcript-text is-agent';
        liveTranscriptText.textContent = activeAssistantBubble.textContent;
      }
    },

    onAnswer: (fullText) => {
      removeTypingIndicator();
      if (!activeAssistantBubble) {
        activeAssistantBubble = document.createElement('div');
        activeAssistantBubble.className = 'srmuh-message-bubble assistant';
        chatBody.appendChild(activeAssistantBubble);
      }
      activeAssistantBubble.textContent = fullText;
      chatBody.scrollTop = chatBody.scrollHeight;
      activeAssistantBubble = null;

      if (liveTranscriptText) {
        liveTranscriptText.className = 'srmuh-live-transcript-text is-agent';
        liveTranscriptText.textContent = fullText;
      }
    },

    onInterrupted: () => {
      voiceStatusText.textContent = 'Interrupted! Listening...';
      if (liveStatusPill) {
        liveStatusPill.className = 'srmuh-live-status-pill is-user-speaking';
        liveStatusPill.textContent = 'Interrupted. Listening to you...';
      }
      if (liveTranscriptText) {
        liveTranscriptText.textContent = 'Listening...';
      }
    },

    onError: (errorMessage) => {
      voiceBar.hidden = false;
      voiceStatusText.textContent = errorMessage;
      if (liveStatusPill) {
        liveStatusPill.textContent = errorMessage;
      }
      setTimeout(() => {
        if (voiceService.status === 'idle') {
          voiceBar.hidden = true;
        }
      }, 4000);
    },
  });

  visualizer.setService(voiceService);

  function openChat() {
    dialog.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    dialog.classList.add('is-open');
    if (isEnabled) {
      chatInput.focus();
    } else {
      closeBtn.focus();
    }
  }

  function closeChat() {
    endLiveVoiceSession();
    dialog.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      dialog.hidden = true;
    }, 250);
    launcher.focus();
  }

  async function startLiveVoiceSession() {
    voiceService.primeAudio();
    if (liveOverlay) {
      liveOverlay.hidden = false;
      liveOverlay.classList.add('is-active');
    }
    if (liveTranscriptText) {
      liveTranscriptText.textContent = 'Connecting to voice service...';
    }
    visualizer.start();
    const ok = await voiceService.startListening();
    if (ok) {
      if (liveTranscriptText) {
        liveTranscriptText.textContent = "Speak naturally, I'm listening...";
      }
    } else {
      if (liveTranscriptText) {
        liveTranscriptText.textContent = "Microphone access needed. Please check browser permissions.";
      }
    }
  }

  function endLiveVoiceSession() {
    voiceService.cleanupAudio();
    visualizer.stop();
    if (liveOverlay) {
      liveOverlay.hidden = true;
      liveOverlay.classList.remove('is-active');
    }
    voiceBar.hidden = true;
  }

  launcher.addEventListener('click', () => {
    if (dialog.hidden) {
      openChat();
    } else {
      closeChat();
    }
  });

  launcher.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openChat();
    }
  });

  closeBtn.addEventListener('click', closeChat);

  // Microphone button opens full-duplex Live Voice overlay
  if (isEnabled && micBtn) {
    micBtn.addEventListener('click', async () => {
      voiceService.primeAudio();
      if (!liveOverlay.hidden) {
        // Toggle minimize if already open
        liveOverlay.hidden = true;
      } else {
        startLiveVoiceSession();
      }
    });

    if (voiceCancelBtn) {
      voiceCancelBtn.addEventListener('click', () => {
        endLiveVoiceSession();
      });
    }
  }

  // Live Overlay Controls
  if (liveMinimizeBtn) {
    liveMinimizeBtn.addEventListener('click', () => {
      if (liveOverlay) {
        liveOverlay.hidden = true;
      }
    });
  }

  if (liveEndBtn) {
    liveEndBtn.addEventListener('click', () => {
      endLiveVoiceSession();
    });
  }

  if (liveInterruptBtn) {
    liveInterruptBtn.addEventListener('click', () => {
      voiceService.interrupt();
    });
  }

  if (liveMuteBtn) {
    liveMuteBtn.addEventListener('click', () => {
      const isMuted = voiceService.toggleMute();
      liveMuteBtn.classList.toggle('is-muted', isMuted);
      if (isMuted) {
        liveMuteBtn.title = 'Unmute Microphone';
        if (liveStatusPill) liveStatusPill.textContent = 'Microphone Muted';
      } else {
        liveMuteBtn.title = 'Mute Microphone';
        if (liveStatusPill) liveStatusPill.textContent = 'Listening continuously...';
      }
    });
  }

  // Esc key closes panel
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !dialog.hidden) {
      closeChat();
    }
  });

  // Focus trap inside modal when open
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const focusable = dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), [tabindex="0"]');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Active chat submission handler (text chat)
  if (isEnabled) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = chatInput.value.trim();
      if (!query) return;

      // Stop any active voice playback or listening before submitting text
      voiceService.cleanupAudio();

      // Add user message bubble
      const userBubble = document.createElement('div');
      userBubble.className = 'srmuh-message-bubble user';
      userBubble.textContent = query;
      chatBody.appendChild(userBubble);
      chatInput.value = '';
      chatBody.scrollTop = chatBody.scrollHeight;

      // Add typing indicator
      showTypingIndicator();

      // Disable inputs while processing
      chatInput.disabled = true;
      sendBtn.disabled = true;

      try {
        const response = await sendMessage(query, sessionId);
        removeTypingIndicator();

        const assistantBubble = document.createElement('div');
        assistantBubble.className = 'srmuh-message-bubble assistant';
        assistantBubble.textContent = response.answer;
        appendSources(assistantBubble, response.sources);
        chatBody.appendChild(assistantBubble);
      } catch (err) {
        removeTypingIndicator();
        const errBubble = document.createElement('div');
        errBubble.className = 'srmuh-message-bubble assistant error';
        errBubble.textContent = "Something went wrong while connecting. Please try again.";
        chatBody.appendChild(errBubble);
      } finally {
        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatInput.focus();
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    });
  }
}
