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

// Self-healing cleanup for legacy keys and cross-contaminated storage
if (typeof window !== "undefined") {
  try {
    const dsCode = localStorage.getItem("orion_code_deepseek");
    const frontierCode = localStorage.getItem("orion_code_frontier");
    const lowCode = localStorage.getItem("orion_code_low");

    // Clean obsolete master keys
    localStorage.removeItem("orion_unlocked_all");
    localStorage.removeItem("astra_frontier_unlocked");
    localStorage.removeItem("astra_frontier_unlocked_code");

    // If frontier code was cross-contaminated with deepseek or master code, wipe it
    if (frontierCode && (frontierCode === dsCode || frontierCode === "00001971")) {
      localStorage.removeItem("orion_unlocked_frontier");
      localStorage.removeItem("orion_code_frontier");
    }

    // Auto-migrate valid lowCode (1952) to frontierCode if present
    if (!localStorage.getItem("orion_code_frontier") && lowCode && lowCode !== dsCode && lowCode !== "00001971") {
      localStorage.setItem("orion_unlocked_frontier", "true");
      localStorage.setItem("orion_code_frontier", lowCode);
    }
  } catch {
    // Ignore storage errors in sandbox environments
  }
}

export function isModelUnlocked(modelId: string, _effort?: string): boolean {
  if (typeof window === "undefined") return false;

  if (modelId.includes("deepseek")) {
    return (
      localStorage.getItem("orion_unlocked_deepseek") === "true" &&
      Boolean(localStorage.getItem("orion_code_deepseek"))
    );
  }

  // All GPT Astra and Claude models (Low, Medium, High)
  return (
    localStorage.getItem("orion_unlocked_frontier") === "true" &&
    Boolean(localStorage.getItem("orion_code_frontier"))
  );
}

// Fallback backend URL (Points to your live Cloudflare Worker proxy)
export const DEFAULT_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://lucky-mud-5827.mohammedabdulmalek197811.workers.dev";

export const DEFAULT_SYSTEM_PROMPT = "";
