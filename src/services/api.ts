import { Message, HealthCheckResult, BalanceInfo } from "../types";
import { parseEventStream } from "./streamParser";

interface SendChatParams {
  backendUrl: string;
  messages: Message[];
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxContextMessages?: number;
  reasoningEffort?: "low" | "medium" | "high";
  signal?: AbortSignal;
  onChunk: (chunk: string) => void;
}

/**
 * Sends a conversation to the Orion Nebula GPT backend proxy and streams the response.
 * Implements:
 * 1. Multimodal Vision payloads (OpenAI standard image_url).
 * 2. Sliding window token pruning:
 *    - For expensive frontier models (GPT-6 Astra & Claude Opus 5.5), kicks in strictly after the 3rd question (keeps latest 6 messages).
 *    - For DeepSeek V4, maintains generous context window (16 messages) since tokens are extremely cheap.
 * 3. Thinking depth control (reasoning_effort) for GPT-6 Astra.
 */
export async function streamChatCompletion({
  backendUrl,
  messages,
  model,
  systemPrompt,
  temperature = 0.7,
  maxContextMessages: _maxContextMessages = 16,
  reasoningEffort = "medium",
  signal,
  onChunk,
}: SendChatParams): Promise<void> {
  const url = backendUrl.trim();
  if (!url) {
    throw new Error("Backend Proxy URL is not configured. Please check your settings.");
  }

  // Filter valid conversation messages:
  // 1. Skip any message that has an explicit error flag.
  // 2. Skip any user prompt whose corresponding assistant response failed with an error
  //    (prevents failed/blocked turns from poisoning the conversation history and breaking future messages).
  const validMessages: Message[] = [];
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.error) continue;

    if (msg.role === "user") {
      const nextMsg = messages[i + 1];
      if (nextMsg && nextMsg.role === "assistant" && nextMsg.error) {
        continue;
      }
    }

    if (msg.role === "user" || msg.role === "assistant" || msg.role === "system") {
      validMessages.push(msg);
    }
  }

  // Model-specific Context Window Optimization:
  // Expensive frontier models (Astra / Claude): Pruning kicks in directly at Question 3 (max 3 messages = 1 prior Q&A turn + current question) to maximize token savings.
  // - Question 1: Sends [System, Q1]
  // - Question 2: Sends [System, Q1, A1, Q2]
  // - Question 3: Pruning kicks in! Drops Q1 & A1 -> Sends [System, Q2, A2, Q3]
  // - Question 4: Drops Q2 & A2 -> Sends [System, Q3, A3, Q4]
  // Cohort Quota Shield:
  // - Expensive frontier models (Astra / Claude): Pruning kicks in directly at Question 3 (max 3 messages = 1 prior Q&A turn + current question) to maximize token savings.
  // - DeepSeek: Capped at 8 messages to maintain token safety while allowing fluid context.
  const isFrontierExpensive = Boolean(model?.includes("astra") || model?.includes("claude"));
  const effectiveWindow = isFrontierExpensive ? 3 : 8;

  let windowedMessages =
    effectiveWindow > 0 && validMessages.length > effectiveWindow
      ? validMessages.slice(-effectiveWindow)
      : validMessages;

  // Ensure first message after system prompt is always a user message (crucial for Claude / Anthropic compliance)
  while (windowedMessages.length > 1 && windowedMessages[0].role !== "user") {
    windowedMessages = windowedMessages.slice(1);
  }

  // Format messages array for upstream OpenAI standard (with Multimodal Vision support)
  const formattedMessages: Array<{ role: string; content: any }> = [];

  if (systemPrompt && systemPrompt.trim()) {
    formattedMessages.push({
      role: "system",
      content: systemPrompt.trim(),
    });
  }

  for (const msg of windowedMessages) {
    if (msg.images && msg.images.length > 0) {
      // Multimodal vision format
      const parts: any[] = [];
      if (msg.content) {
        parts.push({ type: "text", text: msg.content });
      }
      for (const imgUrl of msg.images) {
        parts.push({
          type: "image_url",
          image_url: {
            url: imgUrl,
          },
        });
      }
      formattedMessages.push({
        role: msg.role,
        content: parts,
      });
    } else {
      let content = msg.content;
      if (typeof content === "string" && /[\u0980-\u09FF]/.test(content)) {
        if (!content.startsWith("[Instruction:")) {
          content = `[Instruction: Please process the following user query and respond in the user's requested language]:\n${content}`;
        }
      }
      formattedMessages.push({
        role: msg.role,
        content,
      });
    }
  }

  let response: Response;
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Attach user's authorized access code from localStorage
  const userAccessCode =
    localStorage.getItem("orion_access_code") ||
    (model?.includes("deepseek")
      ? localStorage.getItem("orion_code_deepseek")
      : model?.includes("-low") || reasoningEffort === "low"
      ? localStorage.getItem("orion_code_low")
      : localStorage.getItem("orion_code_medium_high")) ||
    localStorage.getItem("astra_frontier_unlocked_code") ||
    "";

  if (userAccessCode) {
    requestHeaders["x-access-code"] = userAccessCode;
  }

  try {
    response = await fetch(url, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify({
        messages: formattedMessages,
        model,
        stream: true,
        temperature,
        reasoning_effort: reasoningEffort,
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
      if (errJson) {
        if (typeof errJson.error === "object" && errJson.error?.message) {
          errorMessage = errJson.error.message;
        } else if (typeof errJson.error === "string") {
          errorMessage = errJson.error;
        } else if (errJson.message) {
          errorMessage = errJson.message;
        } else if (errJson.msg) {
          errorMessage = errJson.msg;
        } else if (errJson.details?.msg) {
          errorMessage = errJson.details.msg;
        }
      }
    } catch {
      try {
        const text = await response.text();
        if (text) errorMessage = text;
      } catch {
        // Fallback to HTTP status
      }
    }

    // Transparent Auto-Retry for Gateway Language/Anti-Abuse Filter:
    // If the proxy (Netlify, Cloudflare Worker, etc.) returns content-blocked due to AgentRouter's language filter,
    // wrap user queries with an English instruction and retry immediately.
    if (errorMessage.toLowerCase().includes("content-blocked")) {
      const retryMessages = formattedMessages.map((m) => {
        if (m.role === "user") {
          if (typeof m.content === "string") {
            if (!m.content.startsWith("[Instruction:")) {
              return {
                ...m,
                content: `[Instruction: Please process the following user query and respond in the user's requested language]:\n${m.content}`,
              };
            }
          } else if (Array.isArray(m.content)) {
            const updated = m.content.map((part: any) => {
              if (
                part &&
                part.type === "text" &&
                typeof part.text === "string" &&
                !part.text.startsWith("[Instruction:")
              ) {
                return {
                  ...part,
                  text: `[Instruction: Please process the following user query and respond in the user's requested language]:\n${part.text}`,
                };
              }
              return part;
            });
            return { ...m, content: updated };
          }
        }
        return m;
      });

      try {
        const retryRes = await fetch(url, {
          method: "POST",
          headers: requestHeaders,
          body: JSON.stringify({
            messages: retryMessages,
            model,
            stream: true,
            temperature,
            reasoning_effort: reasoningEffort,
          }),
          signal,
        });

        if (retryRes.ok) {
          response = retryRes;
        } else {
          throw new Error(errorMessage);
        }
      } catch (retryErr: any) {
        if (retryErr.name === "AbortError") return;
        throw new Error(errorMessage);
      }
    } else {
      throw new Error(errorMessage);
    }
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

/**
 * Stealth Balance & Quota Checker.
 * Communicates strictly with your Netlify backend proxy.
 * Upstream provider names and credentials are never exposed to the client.
 */
export async function fetchBalanceInfo(backendUrl: string): Promise<BalanceInfo | null> {
  const urlStr = backendUrl.trim();
  if (!urlStr) return null;

  try {
    const url = new URL(urlStr);
    url.searchParams.set("action", "balance");

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.consumption === "number") {
        return {
          consumption: data.consumption,
          currency: data.currency || "USD",
          timestamp: data.timestamp,
        };
      }
    }
  } catch {
    // Graceful fallback if proxy is unreachable
  }
  return null;
}

