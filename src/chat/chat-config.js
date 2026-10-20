// Chat Configuration for SRM University Delhi-NCR Assistant
// Allows environment variables or runtime window override: window.SRMUH_CHAT_CONFIG

const runtimeConfig = (typeof window !== "undefined" && window.SRMUH_CHAT_CONFIG) || {};

export const CHAT_CONFIG = {
  // Chat is enabled — connected to the Saarthi FastAPI backend on port 8000
  CHAT_ENABLED: runtimeConfig.CHAT_ENABLED ?? true,

  // Backend API URL — set via VITE_CHAT_API_URL in .env
  CHAT_API_URL: runtimeConfig.CHAT_API_URL ?? (import.meta.env?.VITE_CHAT_API_URL || "http://localhost:8000/api/chat"),

  BOT_NAME: runtimeConfig.BOT_NAME || "Saarthi AI",

  DISABLED_GREETING: "Hi! I'm coming soon. Chat support will be available shortly.",
  ENABLED_GREETING: "Hi! I'm Saarthi, your campus AI assistant for SRM University Delhi-NCR. Ask me anything about admissions, courses, fees, placements, or campus life!",

  DISABLED_PLACEHOLDER: "Chat will be available soon",
  ENABLED_PLACEHOLDER: "Ask me about admissions, fees, courses..."
};
