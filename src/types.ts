export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  error?: string;
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
}

export interface HealthCheckResult {
  status: "online" | "offline" | "error";
  latencyMs?: number;
  model?: string;
  message?: string;
}
