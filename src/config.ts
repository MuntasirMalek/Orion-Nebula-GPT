/**
 * Global configuration for Orion Nebula GPT.
 * Defaults are tuned for zero-tinkering: friends opening the app
 * connect immediately without entering credentials.
 */

export interface ModelOption {
  id: string;
  name: string;
  tag: string;
  provider: "OpenAI" | "Anthropic";
  description: string;
  contextWindow: string;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "gpt-6-astra",
    name: "GPT-6 Astra",
    tag: "OpenAI Most Powerful Model",
    provider: "OpenAI",
    description: "OpenAI's premier frontier reasoning and software intelligence model.",
    contextWindow: "1,050,000 Tokens",
  },
  {
    id: "claude-opus-5.5",
    name: "Claude Opus 5.5",
    tag: "Claude Most Powerful Model",
    provider: "Anthropic",
    description: "Anthropic's flagship cognitive synthesis and frontier reasoning engine.",
    contextWindow: "1,000,000 Tokens",
  },
];

export const DEFAULT_MODEL_ID = "gpt-6-astra";

// Fallback backend URL (Points to your live Netlify serverless proxy)
export const DEFAULT_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://cool-palmier-9f4ae5.netlify.app/api/chat";

export const DEFAULT_SYSTEM_PROMPT =
  "You are a premier frontier intelligence model. You provide rigorous, deeply structured, and clear analyses with precision engineering and high-order cognitive synthesis.";
