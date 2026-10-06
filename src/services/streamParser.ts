/**
 * Production-ready Server-Sent Events (SSE) stream reader for OpenAI-compatible chat completions.
 * Handles chunk fragmentation, UTF-8 decoding, and SSE line buffering.
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
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const deltaContent =
              parsed.choices?.[0]?.delta?.content ??
              parsed.choices?.[0]?.text ??
              "";

            if (deltaContent) {
              yield deltaContent;
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
        if (data !== "[DONE]") {
          try {
            const parsed = JSON.parse(data);
            const deltaContent =
              parsed.choices?.[0]?.delta?.content ??
              parsed.choices?.[0]?.text ??
              "";
            if (deltaContent) {
              yield deltaContent;
            }
          } catch {
            // Ignore syntax errors in terminal line
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
