export interface AttachedDocument {
  id: string;
  name: string;
  type: "pdf" | "text" | "code";
  size: number;
  pageCount?: number;
  extractedText?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  images?: string[]; // Array of base64 data URLs for multimodal vision support
  documents?: AttachedDocument[]; // Array of attached documents (PDFs, text/code files)
  isStreaming?: boolean;
  error?: string;
  model?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  model?: string;
}

export interface AppSettings {
  backendUrl: string;
  temperature: number;
  systemPrompt: string;
  autoScroll: boolean;
  selectedModel: string;
  maxContextMessages: number; // Token-saving context pruning (e.g. 10, 16, or 0 for full)
  reasoningEffort?: "low" | "medium" | "high"; // Thinking depth control for GPT-6 Astra & Claude
  sendKeyMode?: "enter" | "cmd_enter"; // Advanced setting: Enter vs Cmd+Enter to send
}

export interface BalanceInfo {
  consumption: number;
  currency: string;
  timestamp?: string;
}

export interface HealthCheckResult {
  status: "online" | "offline" | "error";
  latencyMs?: number;
  model?: string;
  message?: string;
}
