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
      return {
        answer: data.answer || "Thank you for contacting SRMUH. Our admissions team will reach out to you.",
        sources: Array.isArray(data.sources) ? data.sources : []
      };
    } catch (err) {
      console.warn("[ChatService] Saarthi information service is unavailable:", err);
      return {
        answer: "Saarthi’s live information service is currently unreachable, so I can’t verify an answer right now. You can browse the programme catalogue or tuition schedule, or contact admissions at +91 88160 33301.",
        sources: ['#page/programmes', '#page/fees', 'https://srmuniversity.ac.in/']
      };
    }
  }

  return {
    answer: "Saarthi’s live information service is not configured in this demo. You can browse the programme catalogue or tuition schedule, or contact admissions at +91 88160 33301.",
    sources: ['#page/programmes', '#page/fees', 'https://srmuniversity.ac.in/']
  };
}
