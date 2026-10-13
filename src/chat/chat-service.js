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
      console.error("[ChatService] Backend request failed, falling back to mock reply:", err);
      // Fallback response on error
      return {
        answer: "Sorry, our university server is momentarily unreachable. Please call our admission helpline at +91-8816033301.",
        sources: []
      };
    }
  }

  // --- MOCK BEHAVIOR (Default 1 second simulated latency) ---
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const lower = query.toLowerCase();
  let answer = "Thank you for reaching out to SRM University Delhi-NCR, Sonepat. Admissions for 2026-27 are currently open across Engineering, Management, Law, and Science disciplines.";

  if (lower.includes('admission') || lower.includes('apply')) {
    answer = "Admissions for 2026-27 are currently open! You can fill out the online application or contact admissions at +91-8816033301 / admissions@srmuniversity.ac.in.";
  } else if (lower.includes('fee') || lower.includes('scholarship')) {
    answer = "SRMUH offers merit-based scholarships up to 100% on tuition fee and accepts Bihar Student Credit Card Scheme. Detailed fee charts are available via the admissions office.";
  } else if (lower.includes('placement') || lower.includes('package')) {
    answer = "Our highest package is ₹50 LPA, with over 1,400+ paid internships and 350+ recruiting partners including PUMA, Ubiquiti, 3Pillar Global, and XenonStack.";
  } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('address')) {
    answer = "Main Campus: 39, Rajiv Gandhi Education City, Delhi-NCR, Sonepat-131029, Haryana. Helplines: +91-8816033301 / 02 / 03 / 04 / 05 / 06.";
  }

  return {
    answer,
    sources: ["https://srmuniversity.ac.in"]
  };
}
