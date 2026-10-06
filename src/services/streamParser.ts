/**
 * Production-ready Server-Sent Events (SSE) stream reader for OpenAI-compatible chat completions.
 * Handles chunk fragmentation, UTF-8 decoding, thinking / reasoning tokens, and SSE line buffering.
 */
export async function* parseEventStream(
  response: Response,
  signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
  if (!response.body) {
    throw new Error("Response body is empty, cannot read stream.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let inThinking = false;
  let hasCheckedWaf = false;

  try {
    while (true) {
      if (signal?.aborted) {
        break;
      }

      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      // Early check for HTML / WAF challenge errors
      if (!hasCheckedWaf && buffer.length > 10) {
        const trimmed = buffer.trimStart();
        if (
          trimmed.startsWith("<!DOCTYPE") ||
          trimmed.startsWith("<!doctype") ||
          trimmed.startsWith("<html") ||
          trimmed.includes("CF_APP_WAF") ||
          trimmed.includes("aliyun_waf")
        ) {
          throw new Error(
            "Upstream firewall challenge detected. Please ensure the latest orion-nebula-gpt-backend.zip is deployed to Netlify."
          );
        }
        hasCheckedWaf = true;
      }

      // Split buffer by newlines to process full SSE lines
      const lines = buffer.split(/\r?\n/);
      // Keep the last partial line in buffer
      buffer = lines.pop() || "";

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || line.startsWith(":")) {
          // Empty line or SSE keep-alive comment
          continue;
        }

        if (line.startsWith("data:")) {
          const data = line.slice(5).trim();

          if (data === "[DONE]") {
            if (inThinking) {
              yield "</think>\n\n";
              inThinking = false;
            }
            return;
          }

          if (!data || data === "null") {
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta;
            const deltaContent = delta?.content ?? parsed.choices?.[0]?.text ?? "";
            const reasoningContent = delta?.reasoning_content ?? "";

            if (reasoningContent) {
              if (!inThinking) {
                inThinking = true;
                yield "<think>" + reasoningContent;
              } else {
                yield reasoningContent;
              }
            } else if (deltaContent) {
              if (inThinking) {
                inThinking = false;
                yield "</think>\n\n" + deltaContent;
              } else {
                yield deltaContent;
              }
            }
          } catch {
            // Incomplete or non-JSON data line, ignore or wait
          }
        }
      }
    }

    // Process any remaining data in the buffer after stream ends
    if (buffer.trim()) {
      const line = buffer.trim();
      if (line.startsWith("data:")) {
        const data = line.slice(5).trim();
        if (data !== "[DONE]" && data !== "null") {
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta;
            const deltaContent = delta?.content ?? parsed.choices?.[0]?.text ?? "";
            const reasoningContent = delta?.reasoning_content ?? "";

            if (reasoningContent) {
              yield reasoningContent;
            } else if (deltaContent) {
              if (inThinking) {
                inThinking = false;
                yield "</think>\n\n" + deltaContent;
              } else {
                yield deltaContent;
              }
            }
          } catch {
            // Ignore syntax errors in terminal line
          }
        }
      }
    }

    if (inThinking) {
      yield "</think>\n\n";
      inThinking = false;
    }
  } finally {
    reader.releaseLock();
  }
}
