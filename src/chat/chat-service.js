/**
 * Chat Service Layer
 * ----------------------------------------------------
 * THIS IS THE ONLY FILE YOU NEED TO EDIT TO CONNECT A REAL BACKEND!
 *
 * Backend Contract:
 * - Request Payload (JSON):
 *   {
 *     "query": "What is the fee structure for B.Tech CSE?",
 *     "session_id": "srmuh-session-xyz"
 *   }
 *
 * - Response Payload (JSON):
 *   {
 *     "answer": "The annual tuition fee for B.Tech CSE is approximately...",
 *     "sources": ["https://srmuniversity.ac.in/fee-structure"]
 *   }
 */

import { CHAT_CONFIG } from './chat-config.js';

function publishServiceStatus(status) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('saarthi-service-status', { detail: { status } }));
  }
}

export async function checkChatService() {
  if (!CHAT_CONFIG.CHAT_API_URL || typeof window === 'undefined') return 'offline';
  const healthUrl = new URL(CHAT_CONFIG.CHAT_API_URL, window.location.href);
  healthUrl.pathname = healthUrl.pathname.replace(/\/chat\/?$/, '/health');
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(healthUrl, { signal: controller.signal });
    if (!response.ok) throw new Error(`Health check returned ${response.status}`);
    const health = await response.json();
    const status = health.status === 'ok'
      ? (health.groq_llm ? 'online' : 'degraded')
      : 'offline';
    publishServiceStatus(status);
    return status;
  } catch {
    publishServiceStatus('offline');
    return 'offline';
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function sendMessage(query, sessionId = 'default-session') {
  // If a real backend URL is configured, make real network request
  if (CHAT_CONFIG.CHAT_API_URL && CHAT_CONFIG.CHAT_API_URL.trim() !== '') {
    try {
      const response = await fetch(CHAT_CONFIG.CHAT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: query.trim(),
          session_id: sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      publishServiceStatus('online');
      return {
        answer: data.answer || "Thank you for contacting SRMUH. Our admissions team will reach out to you.",
        sources: Array.isArray(data.sources) ? data.sources : []
      };
    } catch (err) {
      console.warn("[ChatService] Saarthi information service is unavailable:", err);
      publishServiceStatus('offline');
      return {
        answer: "I can’t reach the student-support service right now. Please try again shortly.",
        sources: []
      };
    }
  }

  return {
    answer: "The student-support service is not configured yet. Please try again shortly.",
    sources: []
  };
}
