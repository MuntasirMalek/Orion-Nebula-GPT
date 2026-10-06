/**
 * Global configuration for Orion Nebula GPT.
 * Defines 6 versions for Astra & Claude (Low, Medium, High thinking) + DeepSeek V4.
 * 
 * SECURITY NOTE:
 * Passcodes are verified 100% server-side on the Netlify Serverless Gateway.
 * No plaintext passcodes or secrets are stored in this frontend codebase,
 * keeping the open-source GitHub repository and GitHub Pages fully secure.
 */

export interface ModelOption {
  id: string;
  name: string;
  tag: string;
  provider: "OpenAI" | "Anthropic" | "DeepSeek";
  description: string;
  contextWindow: string;
  requiresPasscode: boolean;
  defaultEffort?: "low" | "medium" | "high";
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek V4",
    tag: "DeepSeek Frontier Model",
    provider: "DeepSeek",
    description: "High-speed reasoning and code intelligence engine. Requires student cohort passcode.",
    contextWindow: "128,000 Tokens",
    requiresPasscode: true,
  },
  {
    id: "gpt-6-astra-low",
    name: "GPT-6 Astra (Low Thinking)",
    tag: "OpenAI Frontier Model",
    provider: "OpenAI",
    description: "OpenAI frontier model with Low reasoning effort. Fast, token-efficient.",
    contextWindow: "128,000 Tokens",
    requiresPasscode: true,
    defaultEffort: "low",
  },
  {
    id: "gpt-6-astra-medium",
    name: "GPT-6 Astra (Medium Thinking)",
    tag: "OpenAI Frontier Model",
    provider: "OpenAI",
    description: "OpenAI premier frontier reasoning model with Medium depth. Balanced synthesis.",
    contextWindow: "128,000 Tokens",
    requiresPasscode: true,
    defaultEffort: "medium",
  },
  {
    id: "gpt-6-astra-high",
    name: "GPT-6 Astra (High Thinking)",
    tag: "OpenAI Frontier Model",
    provider: "OpenAI",
    description: "OpenAI premier frontier reasoning model with High depth. Deep multi-step verification.",
    contextWindow: "128,000 Tokens",
    requiresPasscode: true,
    defaultEffort: "high",
  },
  {
    id: "claude-opus-5.5-low",
    name: "Claude Opus 5.5 (Low Thinking)",
    tag: "Claude Frontier Model",
    provider: "Anthropic",
    description: "Anthropic flagship cognitive model with Low reasoning effort. Agile and direct.",
    contextWindow: "200,000 Tokens",
    requiresPasscode: true,
    defaultEffort: "low",
  },
  {
    id: "claude-opus-5.5-medium",
    name: "Claude Opus 5.5 (Medium Thinking)",
    tag: "Claude Frontier Model",
    provider: "Anthropic",
    description: "Anthropic flagship cognitive model with Medium depth. Nuanced reasoning.",
    contextWindow: "200,000 Tokens",
    requiresPasscode: true,
    defaultEffort: "medium",
  },
  {
    id: "claude-opus-5.5-high",
    name: "Claude Opus 5.5 (High Thinking)",
    tag: "Claude Frontier Model",
    provider: "Anthropic",
    description: "Anthropic flagship cognitive model with High depth. Maximum architectural rigor.",
    contextWindow: "200,000 Tokens",
    requiresPasscode: true,
    defaultEffort: "high",
  },
];

export const DEFAULT_MODEL_ID = "gpt-6-astra-low";

export function isModelUnlocked(modelId: string, effort?: string): boolean {
  if (typeof window === "undefined") return false;
  // If master access was granted
  if (localStorage.getItem("orion_unlocked_all") === "true") return true;

  if (modelId.includes("deepseek")) {
    return (
      localStorage.getItem("orion_unlocked_deepseek") === "true" ||
      Boolean(localStorage.getItem("orion_code_deepseek"))
    );
  }

  const eff = modelId.includes("-low") ? "low" : modelId.includes("-high") ? "high" : (effort || "medium");
  if (eff === "low") {
    return (
      localStorage.getItem("orion_unlocked_low") === "true" ||
      localStorage.getItem("orion_unlocked_medium_high") === "true" ||
      Boolean(localStorage.getItem("orion_code_low")) ||
      Boolean(localStorage.getItem("orion_code_medium_high"))
    );
  }

  return (
    localStorage.getItem("orion_unlocked_medium_high") === "true" ||
    Boolean(localStorage.getItem("orion_code_medium_high"))
  );
}

// Fallback backend URL (Points to your live Netlify serverless proxy)
export const DEFAULT_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://ornate-eclair-dbdce0.netlify.app/api/chat";

export const DEFAULT_SYSTEM_PROMPT = "";
