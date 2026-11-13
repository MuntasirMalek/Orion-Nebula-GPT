export interface AttachedFolderFile {
  path: string;
  size: number;
  lineCount?: number;
  pageCount?: number;
  truncated?: boolean;
}

export interface AttachedDocument {
  id: string;
  name: string;
  type: "pdf" | "text" | "code" | "folder";
  size: number;
  pageCount?: number;
  lineCount?: number;
  fileCount?: number;
  skippedCount?: number;
  skippedSummary?: string[];
  folderFiles?: AttachedFolderFile[];
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
  reasoningEffort?: "low" | "medium" | "high"; // Thinking depth control for reasoning models
  sendKeyMode?: "enter" | "cmd_enter"; // Advanced setting: Enter vs Cmd+Enter to send
}
