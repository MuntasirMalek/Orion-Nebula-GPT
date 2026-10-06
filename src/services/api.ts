import { Message, HealthCheckResult } from "../types";
import { parseEventStream } from "./streamParser";

interface SendChatParams {
  backendUrl: string;
  messages: Message[];
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  signal?: AbortSignal;
  onChunk: (chunk: string) => void;
}

/**
 * Sends a conversation to the Orion Nebula GPT backend proxy and streams the response.
 */
export async function streamChatCompletion({
  backendUrl,
  messages,
  model,
  systemPrompt,
  temperature = 0.7,
  signal,
  onChunk,
}: SendChatParams): Promise<void> {
  const url = backendUrl.trim();
  if (!url) {
    throw new Error("Backend Proxy URL is not configured. Please check your settings.");
  }

  // Format messages array for upstream OpenAI standard
  const formattedMessages: Array<{ role: string; content: string }> = [];

  if (systemPrompt && systemPrompt.trim()) {
    formattedMessages.push({
      role: "system",
      content: systemPrompt.trim(),
    });
  }

  // Add existing messages excluding errors or transient states
  for (const msg of messages) {
    if (msg.role === "user" || msg.role === "assistant" || msg.role === "system") {
      formattedMessages.push({
        role: msg.role,
        content: msg.content,
      });
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: formattedMessages,
        model,
        stream: true,
        temperature,
      }),
      signal,
    });
  } catch (err: any) {
    if (err.name === "AbortError") {
      return;
    }
    throw new Error(
      `Unable to connect to Orion Proxy at "${url}". Please ensure your backend is deployed or check Settings.`
    );
  }

  if (!response.ok) {
    let errorMessage = `Orion Proxy returned HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      errorMessage =
        errJson.error ||
        errJson.message ||
        errJson.msg ||
        errJson.details?.msg ||
        errorMessage;
    } catch {
      try {
        const text = await response.text();
        if (text) errorMessage = text;
      } catch {
        // Fallback to HTTP status
      }
    }
    throw new Error(errorMessage);
  }

  for await (const chunk of parseEventStream(response, signal)) {
    onChunk(chunk);
  }
}

/**
 * Diagnostic tool to check connectivity and latency with the Orion Nebula GPT backend proxy.
 */
export async function testBackendHealth(backendUrl: string): Promise<HealthCheckResult> {
  const url = backendUrl.trim();
  if (!url) {
    return {
      status: "offline",
      message: "No Backend Proxy URL provided.",
    };
  }

  const startTime = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const latencyMs = Math.round(performance.now() - startTime);

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        status: "online",
        latencyMs,
        model: data.model || "gpt-6-astra",
        message: data.gatewayConfigured
          ? "Connected & Gateway Authenticated"
          : "Connected to Proxy (Verify Gateway Keys)",
      };
    } else {
      return {
        status: "error",
        latencyMs,
        message: `HTTP ${res.status} response from proxy`,
      };
    }
  } catch (err: any) {
    clearTimeout(timeoutId);
    return {
      status: "offline",
      message: err.name === "AbortError" ? "Connection timed out (7s)" : "Network connection failed",
    };
  }
}
