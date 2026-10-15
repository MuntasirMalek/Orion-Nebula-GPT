/**
 * Global configuration for Orion Nebula GPT.
 * Supports:
 * 1. DeepSeek V4 (Default, Unlocked, Free access)
 * 2. OpenAI GPT-6 Astra (Low, Medium, High thinking - Frontier Cohort)
 * 3. Anthropic Claude Opus 5.5 (Low, Medium, High thinking - Frontier Cohort)
 * 4. Mistral Large 4 (xKiro, Unlocked)
 * 5. Qwen 3.8 Max (xKiro, Unlocked)
 * 6. Qwen 3.8 Omni Flash (xKiro, Unlocked)
 * 7. Meta Muse Spark 1.3 (xKiro, Unlocked)
 * 
 * SECURITY NOTE:
 * Passcodes are verified server-side on the Serverless Gateway / Cloudflare Worker.
 * No plaintext passcodes or secrets are stored in this frontend codebase,
 * keeping the open-source GitHub repository and GitHub Pages 100% clean and secure.
 */

export interface ModelOption {
  id: string;
  name: string;
  tag: string;
  provider: "OpenAI" | "Anthropic" | "DeepSeek" | "Mistral" | "Qwen" | "Meta";
  description: string;
  contextWindow: string;
  requiresPasscode: boolean;
  defaultEffort?: "low" | "medium" | "high";
}

export const AVAILABLE_MODELS: ModelOption[] = [
  // 1. DeepSeek V4 (Default - Open & Unlocked)
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek V4",
    tag: "DeepSeek Frontier Model",
    provider: "DeepSeek",
    description: "High-speed reasoning and code intelligence engine. Free and unlocked for everyone.",
    contextWindow: "128,000 Tokens",
    requiresPasscode: false,
  },

  // 2. Mistral Large 4 (Unlocked)
  {
    id: "mistralai/mistral-large-4-0",
    name: "Mistral Large 4",
    tag: "Mistral AI",
    provider: "Mistral",
    description: "Mistral's flagship frontier reasoning model. Multilingual, vision-enabled, top-tier coding.",
    contextWindow: "128,000 Tokens",
    requiresPasscode: false,
  },

  // 3. Qwen 3.8 Max (Unlocked)
  {
    id: "qwen/qwen3.8-max:free",
    name: "Qwen 3.8 Max",
    tag: "Alibaba Qwen",
    provider: "Qwen",
    description: "Alibaba's premier flagship reasoning engine. Exceptional math, coding, and logical reasoning.",
    contextWindow: "128,000 Tokens",
    requiresPasscode: false,
  },

  // 4. Qwen 3.8 Omni Flash (Unlocked)
  {
    id: "qwen/qwen3.8-omni-flash:free",
    name: "Qwen 3.8 Omni Flash",
    tag: "Alibaba Qwen",
    provider: "Qwen",
    description: "Ultra-fast omni multimodal speed engine with instant response generation.",
    contextWindow: "128,000 Tokens",
    requiresPasscode: false,
  },

  // 5. Meta Muse Spark 1.3 (Unlocked)
  {
    id: "meta/muse-spark-1.3-contributor:free",
    name: "Meta Muse Spark 1.3",
    tag: "Meta AI",
    provider: "Meta",
    description: "Meta open-weights research reasoning model for scientific synthesis and deep generation.",
    contextWindow: "128,000 Tokens",
    requiresPasscode: false,
  },

  // 6. GPT-6 Astra - Frontier Cohort
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

  // 7. Claude Opus 5.5 - Frontier Cohort
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

export const DEFAULT_MODEL_ID = "deepseek-v4-flash";

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
    if (frontierCode && (frontierCode === dsCode || frontierCode === "auth_key_b")) {
      localStorage.removeItem("orion_unlocked_frontier");
      localStorage.removeItem("orion_code_frontier");
    }

    // Auto-migrate valid lowCode to frontierCode if present
    if (!localStorage.getItem("orion_code_frontier") && lowCode && lowCode !== dsCode && lowCode !== "auth_key_b") {
      localStorage.setItem("orion_unlocked_frontier", "true");
      localStorage.setItem("orion_code_frontier", lowCode);
    }
  } catch {
    // Ignore storage errors in sandbox environments
  }
}

export function isModelUnlocked(modelId: string, _effort?: string): boolean {
  if (typeof window === "undefined") return false;

  const target = AVAILABLE_MODELS.find((m) => m.id === modelId);
  // Any model with requiresPasscode = false is always unlocked (DeepSeek, Mistral, Qwen, Meta)
  if (target && !target.requiresPasscode) {
    return true;
  }

  if (
    modelId.includes("deepseek") ||
    modelId.includes("mistral") ||
    modelId.includes("qwen") ||
    modelId.includes("meta")
  ) {
    return true;
  }

  // All GPT Astra and Claude models (Low, Medium, High) require frontier cohort code
  return (
    localStorage.getItem("orion_unlocked_frontier") === "true" &&
    Boolean(localStorage.getItem("orion_code_frontier"))
  );
}

// Fallback backend URL (Points to your live Cloudflare Worker proxy)
export const DEFAULT_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://lucky-mud-5827.mohammedabdulmalek197811.workers.dev";

export const DEFAULT_SYSTEM_PROMPT = "";
