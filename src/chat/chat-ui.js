import { CHAT_CONFIG } from './chat-config.js';
import { sendMessage } from './chat-service.js';

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
            <span class="srmuh-chat-status">${isEnabled ? '● Online (Instant Reply)' : '○ Standby Mode'}</span>
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
    dialog.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      dialog.hidden = true;
    }, 250);
    launcher.focus();
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

  // Active chat submission handler
  if (isEnabled) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = chatInput.value.trim();
      if (!query) return;

      // Add user message bubble
      const userBubble = document.createElement('div');
      userBubble.className = 'srmuh-message-bubble user';
      userBubble.textContent = query;
      chatBody.appendChild(userBubble);
      chatInput.value = '';
      chatBody.scrollTop = chatBody.scrollHeight;

      // Add typing indicator
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'srmuh-message-bubble assistant typing';
      typingIndicator.innerHTML = `
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      `;
      chatBody.appendChild(typingIndicator);
      chatBody.scrollTop = chatBody.scrollHeight;

      // Disable inputs while processing
      chatInput.disabled = true;
      sendBtn.disabled = true;

      try {
        const response = await sendMessage(query, sessionId);
        typingIndicator.remove();

        const assistantBubble = document.createElement('div');
        assistantBubble.className = 'srmuh-message-bubble assistant';
        assistantBubble.textContent = response.answer;
        chatBody.appendChild(assistantBubble);
      } catch (err) {
        typingIndicator.remove();
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
