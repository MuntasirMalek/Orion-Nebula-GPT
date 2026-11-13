/**
 * Global configuration for Orion Nebula GPT.
 * Supports:
 * 1. DeepSeek-V4.1-Flash-1017 (Passcode Protected)
 * 2. GLM-5.3-Flash (Passcode Protected)
 * 3. Kimi K3.1 Pro (Passcode Protected)
 * 4. Nemotron 3.5 Super VL (Passcode Protected)
 * 5. Qwen 3.8 Omni Flash (Passcode Protected)
 * 6. Qwen 3.8 Max (Passcode Protected)
 * 7. Mistral Large 3 (Passcode Protected)
 * 8. OpenAI GPT-6 Astra (Low, Medium, High thinking - GPT Tier)
 * 9. OpenAI GPT-6.1 Sol (Low, Medium, High thinking - GPT Tier)
 * 10. Anthropic Claude Opus 5.5 (Low, Medium, High thinking - Claude Tier)
 *
 * SECURITY NOTE:
 * Passcodes are verified server-side on the Serverless Gateway / Cloudflare Worker.
 * No plaintext passcodes or secrets are stored in this frontend codebase,
 * keeping the open-source GitHub repository and GitHub Pages 100% clean and secure.
 */

export type ModelProvider =
  | "OpenAI"
  | "Anthropic"
  | "DeepSeek"
  | "Mistral"
  | "Qwen"
  | "Meta"
  | "Zhipu"
  | "Moonshot"
  | "NVIDIA";

export interface ModelOption {
  id: string;
  name: string;
  tag: string;
  provider: ModelProvider;
  description: string;
  contextWindow: string;
  requiresPasscode: boolean;
  defaultEffort?: "low" | "medium" | "high";
}

export interface ProviderUiStyle {
  badgeClass: string;
  selectedCardClass: string;
  checkClass: string;
}

const PROVIDER_UI_STYLES: Record<ModelProvider, ProviderUiStyle> = {
  Anthropic: {
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
    selectedCardClass: "bg-rose-50/90 border-rose-400 shadow-sm",
    checkClass: "text-rose-600",
  },
  DeepSeek: {
    badgeClass: "bg-sky-50 text-sky-800 border-sky-200",
    selectedCardClass: "bg-sky-50/90 border-sky-400 shadow-sm",
    checkClass: "text-sky-600",
  },
  Zhipu: {
    badgeClass: "bg-zinc-100 text-zinc-800 border-zinc-300",
    selectedCardClass: "bg-zinc-50/90 border-zinc-400 shadow-sm",
    checkClass: "text-zinc-700",
  },
  Moonshot: {
    badgeClass: "bg-violet-50 text-violet-800 border-violet-200",
    selectedCardClass: "bg-violet-50/90 border-violet-400 shadow-sm",
    checkClass: "text-violet-600",
  },
  NVIDIA: {
    badgeClass: "bg-lime-50 text-lime-800 border-lime-300",
    selectedCardClass: "bg-lime-50/90 border-lime-500 shadow-sm",
    checkClass: "text-lime-700",
  },
  Mistral: {
    badgeClass: "bg-orange-50 text-orange-800 border-orange-200",
    selectedCardClass: "bg-orange-50/90 border-orange-400 shadow-sm",
    checkClass: "text-orange-600",
  },
  Qwen: {
    badgeClass: "bg-indigo-50 text-indigo-800 border-indigo-200",
    selectedCardClass: "bg-indigo-50/90 border-indigo-400 shadow-sm",
    checkClass: "text-indigo-600",
  },
  Meta: {
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
    selectedCardClass: "bg-blue-50/90 border-blue-400 shadow-sm",
    checkClass: "text-blue-600",
  },
  OpenAI: {
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    selectedCardClass: "bg-emerald-50/90 border-emerald-400 shadow-sm",
    checkClass: "text-emerald-600",
  },
};

export function getModelProviderUiStyle(model: Pick<ModelOption, "id" | "provider">): ProviderUiStyle {
  return PROVIDER_UI_STYLES[model.provider] || PROVIDER_UI_STYLES.OpenAI;
}

export type PasscodeTier = "claude" | "gpt" | "other";

export const PASSCODE_STORAGE_KEYS: Record<PasscodeTier, { unlocked: string; code: string }> = {
  claude: { unlocked: "orion_v2_unlocked_claude", code: "orion_v2_code_claude" },
  gpt: { unlocked: "orion_v2_unlocked_gpt", code: "orion_v2_code_gpt" },
  other: { unlocked: "orion_v2_unlocked_other", code: "orion_v2_code_other" },
};

export function getModelPasscodeTier(modelId: string): PasscodeTier {
  const normalized = (modelId || "").toLowerCase();
  if (normalized.includes("claude") || normalized.includes("opus")) {
    return "claude";
  }
  if (
    normalized.includes("gpt") ||
    normalized.includes("astra") ||
    normalized.includes("sol")
  ) {
    return "gpt";
  }
  return "other";
}

export const AVAILABLE_MODELS: ModelOption[] = [
  // 1. DeepSeek-V4.1-Flash-1017
  {
    id: "deepseek/deepseek-v4.1-flash-1017",
    name: "DeepSeek-V4.1-Flash-1017",
    tag: "DeepSeek",
    provider: "DeepSeek",
    description: "High-speed DeepSeek V4.1 reasoning and code intelligence engine.",
    contextWindow: "128,000 Tokens",
    requiresPasscode: true,
  },

  // 2. GLM-5.3-Flash
  {
    id: "z-ai/glm-5.3-flash",
    name: "GLM-5.3-Flash",
    tag: "Zhipu AI",
    provider: "Zhipu",
    description: "High-speed GLM-5.3 reasoning and coding flash engine.",
    contextWindow: "128,000 Tokens",
    requiresPasscode: true,
  },

  // 3. Kimi K3.1 Pro
  {
    id: "moonshotai/kimi-k3.1-pro",
    name: "Kimi K3.1 Pro",
    tag: "Moonshot AI",
    provider: "Moonshot",
    description: "Flagship Kimi K3.1 Pro engine for deep analysis and long-context reasoning.",
    contextWindow: "256,000 Tokens",
    requiresPasscode: true,
  },

  // 4. Nemotron 3.5 Super VL
  {
    id: "nvidia/nemotron-3.5-super-vl:free",
    name: "Nemotron 3.5 Super VL",
    tag: "NVIDIA",
    provider: "NVIDIA",
    description: "NVIDIA multimodal Nemotron 3.5 Super vision-language reasoning engine.",
    contextWindow: "1,000,000 Tokens",
    requiresPasscode: true,
  },

  // 5. Qwen 3.8 Omni Flash
  {
    id: "qwen/qwen3.8-omni-flash:free",
    name: "Qwen 3.8 Omni Flash",
    tag: "Alibaba Qwen",
    provider: "Qwen",
    description: "Ultra-fast omni multimodal speed engine with instant response generation.",
    contextWindow: "128,000 Tokens",
    requiresPasscode: true,
  },

  // 6. Qwen 3.8 Max
  {
    id: "qwen/qwen3.8-max:free",
    name: "Qwen 3.8 Max",
    tag: "Alibaba Qwen",
    provider: "Qwen",
    description: "Alibaba's premier flagship reasoning engine. Exceptional math, coding, and logical reasoning.",
    contextWindow: "128,000 Tokens",
    requiresPasscode: true,
  },

  // 7. Mistral Large 3
  {
    id: "mistralai/mistral-large-2512",
    name: "Mistral Large 3",
    tag: "Mistral AI",
    provider: "Mistral",
    description: "Mistral's flagship frontier reasoning model. Multilingual, vision-enabled, top-tier coding.",
    contextWindow: "128,000 Tokens",
    requiresPasscode: true,
  },

  // 5. GPT-6 Astra - GPT Tier
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

  // 6. GPT-6.1 Sol - GPT Tier
  {
    id: "gpt-6.1-sol-low",
    name: "GPT-6.1 Sol (Low Thinking)",
    tag: "OpenAI Frontier Model",
    provider: "OpenAI",
    description: "Next-gen GPT-6.1 Sol with Low reasoning effort. Ultra-responsive frontier intelligence.",
    contextWindow: "128,000 Tokens",
    requiresPasscode: true,
    defaultEffort: "low",
  },
  {
    id: "gpt-6.1-sol-medium",
    name: "GPT-6.1 Sol (Medium Thinking)",
    tag: "OpenAI Frontier Model",
    provider: "OpenAI",
    description: "Next-gen GPT-6.1 Sol premier reasoning model with Medium depth. High-accuracy cognitive synthesis.",
    contextWindow: "128,000 Tokens",
    requiresPasscode: true,
    defaultEffort: "medium",
  },
  {
    id: "gpt-6.1-sol-high",
    name: "GPT-6.1 Sol (High Thinking)",
    tag: "OpenAI Frontier Model",
    provider: "OpenAI",
    description: "Next-gen GPT-6.1 Sol premier reasoning model with High depth. Deep multi-step verification.",
    contextWindow: "128,000 Tokens",
    requiresPasscode: true,
    defaultEffort: "high",
  },

  // 7. Claude Opus 5.5 - Claude Tier
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

export const DEFAULT_MODEL_ID = "qwen/qwen3.8-max:free";

export function getStoredAccessCodeForModel(modelId: string): string {
  if (typeof window === "undefined") return "";
  try {
    const tier = getModelPasscodeTier(modelId);
    const keys = PASSCODE_STORAGE_KEYS[tier];
    if (localStorage.getItem(keys.unlocked) === "true") {
      return localStorage.getItem(keys.code) || "";
    }
  } catch {
    // Ignore storage errors in sandbox environments
  }
  return "";
}

export function isModelUnlocked(modelId: string, _effort?: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const tier = getModelPasscodeTier(modelId);
    const keys = PASSCODE_STORAGE_KEYS[tier];
    return (
      localStorage.getItem(keys.unlocked) === "true" &&
      Boolean(localStorage.getItem(keys.code))
    );
  } catch {
    return false;
  }
}

// Permanent hardcoded Cloudflare Worker proxy gateway
export const DEFAULT_BACKEND_URL = "https://orion-nebula-gateway.alanturing197811.workers.dev";

export const DEFAULT_SYSTEM_PROMPT = "";
