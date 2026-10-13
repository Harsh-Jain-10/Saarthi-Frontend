// Chat Configuration for SRM University Delhi-NCR Assistant
// Allows environment variables or runtime window override: window.SRMUH_CHAT_CONFIG

const runtimeConfig = (typeof window !== "undefined" && window.SRMUH_CHAT_CONFIG) || {};

export const CHAT_CONFIG = {
  // Set to true to enable active conversational mode with mock or real API
  // Kept false by default per mission requirements
  CHAT_ENABLED: runtimeConfig.CHAT_ENABLED ?? false,

  // Backend API URL when ready. Can be set via VITE_CHAT_API_URL in .env
  CHAT_API_URL: runtimeConfig.CHAT_API_URL ?? (import.meta.env?.VITE_CHAT_API_URL || ""),

  BOT_NAME: runtimeConfig.BOT_NAME || "SRMUH Assistant",

  DISABLED_GREETING: "Hi! I'm coming soon. Chat support will be available shortly.",
  ENABLED_GREETING: "Hello! Welcome to SRM University Delhi-NCR. How can I assist you with admissions, faculties, or campus life today?",

  DISABLED_PLACEHOLDER: "Chat will be available soon",
  ENABLED_PLACEHOLDER: "Type your query here (e.g. Admissions, Fees)..."
};
