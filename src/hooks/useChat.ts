import { useState, useRef, useCallback, useEffect } from "react";
import { Message, ChatSession, AppSettings } from "../types";
import { DEFAULT_BACKEND_URL, DEFAULT_SYSTEM_PROMPT, DEFAULT_MODEL_ID, AVAILABLE_MODELS } from "../config";
import { useLocalStorage } from "./useLocalStorage";
import { streamChatCompletion } from "../services/api";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useChat() {
  const [settings, setSettings] = useLocalStorage<AppSettings>("astra_settings_v1", {
    backendUrl: DEFAULT_BACKEND_URL,
    temperature: 0.7,
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    autoScroll: true,
    selectedModel: DEFAULT_MODEL_ID,
    maxContextMessages: 8,
    reasoningEffort: "low",
    sendKeyMode: "enter",
  });

  const [sessions, setSessions] = useLocalStorage<ChatSession[]>("astra_sessions_v1", (): ChatSession[] => {
    const defaultId = generateId();
    return [
      {
        id: defaultId,
        title: "New Conversation",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [] as Message[],
      },
    ];
  });

  const [currentSessionId, setCurrentSessionId] = useLocalStorage<string>(
    "astra_active_session_id_v1",
    () => (sessions.length > 0 ? sessions[0].id : "")
  );

  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-migrate legacy cached prompt and model to GPT-6 Astra Low default
  useEffect(() => {
    if (
      settings.systemPrompt &&
      settings.systemPrompt.includes("You are a premier frontier intelligence model")
    ) {
      setSettings((prev) => ({ ...prev, systemPrompt: "" }));
    }
    if (
      !settings.backendUrl ||
      settings.backendUrl.includes("papaya-trifle") ||
      settings.backendUrl.includes("ornate-eclair") ||
      settings.backendUrl.includes("symphonious-lamington") ||
      settings.backendUrl.includes("netlify.app")
    ) {
      setSettings((prev) => ({
        ...prev,
        backendUrl: DEFAULT_BACKEND_URL,
      }));
    }
  }, []);

  // Fallback to first session if current ID is invalid
  const currentSession =
    sessions.find((s) => s.id === currentSessionId) ||
    sessions[0] || {
      id: generateId(),
      title: "New Conversation",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };

  const createNewSession = useCallback(() => {
    if (isStreaming) {
      abortControllerRef.current?.abort();
      setIsStreaming(false);
    }
    const newSession: ChatSession = {
      id: generateId(),
      title: "New Conversation",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  }, [isStreaming, setSessions, setCurrentSessionId]);

  const switchSession = useCallback(
    (id: string) => {
      if (isStreaming) {
        abortControllerRef.current?.abort();
        setIsStreaming(false);
      }
      setCurrentSessionId(id);
    },
    [isStreaming, setCurrentSessionId]
  );

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => {
        const remaining = prev.filter((s) => s.id !== id);
        if (remaining.length === 0) {
          const fresh: ChatSession = {
            id: generateId(),
            title: "New Conversation",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            messages: [],
          };
          setCurrentSessionId(fresh.id);
          return [fresh];
        }
        if (currentSessionId === id) {
          setCurrentSessionId(remaining[0].id);
        }
        return remaining;
      });
    },
    [currentSessionId, setCurrentSessionId, setSessions]
  );

  const renameSession = useCallback(
    (id: string, newTitle: string) => {
      const trimmed = newTitle.trim() || "Untitled Conversation";
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, title: trimmed, updatedAt: Date.now() } : s))
      );
    },
    [setSessions]
  );

  const clearAllSessions = useCallback(() => {
    if (isStreaming) {
      abortControllerRef.current?.abort();
      setIsStreaming(false);
    }
    const fresh: ChatSession = {
      id: generateId(),
      title: "New Conversation",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    setSessions([fresh]);
    setCurrentSessionId(fresh.id);
  }, [isStreaming, setSessions, setCurrentSessionId]);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);

    // Turn off isStreaming state on last assistant message
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== currentSessionId) return s;
        const updated = s.messages.map((m, idx) =>
          idx === s.messages.length - 1 && m.role === "assistant"
            ? { ...m, isStreaming: false }
            : m
        );
        return { ...s, messages: updated };
      })
    );
  }, [currentSessionId, setSessions]);

  const sendMessage = useCallback(
    async (text: string, images?: string[]) => {
      const content = text.trim();
      const hasImages = Array.isArray(images) && images.length > 0;
      if ((!content && !hasImages) || isStreaming) return;

      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: Date.now(),
        ...(hasImages ? { images } : {}),
      };

      const assistantMsgId = generateId();
      const initialAssistantMsg: Message = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        isStreaming: true,
      };

      // Auto title session from first user message if title is default
      let newTitle = currentSession.title;
      if (
        (currentSession.messages.length === 0 || currentSession.title === "New Conversation") &&
        (content.length > 0 || hasImages)
      ) {
        if (content.length > 0) {
          newTitle = content.slice(0, 32).trim() + (content.length > 32 ? "..." : "");
        } else {
          newTitle = "Vision Analysis";
        }
      }

      // Append messages into session
      const historyWithUser = [...currentSession.messages, userMsg];

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? {
                ...s,
                title: newTitle,
                updatedAt: Date.now(),
                messages: [...historyWithUser, initialAssistantMsg],
              }
            : s
        )
      );

      setIsStreaming(true);
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        let accumulatedText = "";
        let rafId: number | null = null;

        const flushStreamUpdate = () => {
          rafId = null;
          setSessions((prev) =>
            prev.map((s) => {
              if (s.id !== currentSessionId) return s;
              const msgs = s.messages.map((m) =>
                m.id === assistantMsgId
                  ? { ...m, content: accumulatedText, isStreaming: true }
                  : m
              );
              return { ...s, messages: msgs, updatedAt: Date.now() };
            })
          );
        };

        await streamChatCompletion({
          backendUrl: settings.backendUrl,
          messages: historyWithUser,
          model: currentSession.model || settings.selectedModel || DEFAULT_MODEL_ID,
          systemPrompt: settings.systemPrompt,
          temperature: settings.temperature,
          maxContextMessages: settings.maxContextMessages ?? 16,
          reasoningEffort: settings.reasoningEffort || "medium",
          signal: abortController.signal,
          onChunk: (chunk: string) => {
            accumulatedText += chunk;
            if (rafId === null) {
              rafId = requestAnimationFrame(flushStreamUpdate);
            }
          },
        });

        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }

        // Mark streaming finished and commit final text
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== currentSessionId) return s;
            const msgs = s.messages.map((m) =>
              m.id === assistantMsgId ? { ...m, content: accumulatedText, isStreaming: false } : m
            );
            return { ...s, messages: msgs, updatedAt: Date.now() };
          })
        );
      } catch (err: any) {
        if (err.name === "AbortError") {
          return;
        }

        const errorMessage = err?.message || "Failed to generate completion.";
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== currentSessionId) return s;
            const msgs = s.messages.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: m.content || "⚠️ Error encountered while communicating with Orion Nebula GPT.",
                    isStreaming: false,
                    error: errorMessage,
                  }
                : m
            );
            return { ...s, messages: msgs, updatedAt: Date.now() };
          })
        );
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [currentSession, currentSessionId, isStreaming, settings, setSessions]
  );

  const exportCurrentChat = useCallback(
    (format: "markdown" | "json" = "markdown") => {
      const title = currentSession.title.replace(/[^a-zA-Z0-9_-]/g, "_");
      let dataStr = "";
      let filename = `${title}.md`;

      if (format === "json") {
        dataStr = JSON.stringify(currentSession, null, 2);
        filename = `${title}.json`;
      } else {
        const lines: string[] = [
          `# ${currentSession.title}`,
          `*Exported from Orion Nebula GPT on ${new Date().toLocaleString()}*`,
          "",
          "---",
          "",
        ];
        for (const msg of currentSession.messages) {
          const roleLabel = msg.role === "user" ? "### 👤 User" : "### 🌌 Orion Nebula GPT";
          lines.push(roleLabel, "", msg.content, "", "---", "");
        }
        dataStr = lines.join("\n");
      }

      const blob = new Blob([dataStr], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [currentSession]
  );

  const changeModel = useCallback(
    (newModelId: string) => {
      const modelDef = AVAILABLE_MODELS.find((m) => m.id === newModelId);
      const effort = modelDef?.defaultEffort || "medium";
      setSettings((prev) => ({
        ...prev,
        selectedModel: newModelId,
        reasoningEffort: modelDef?.defaultEffort ? effort : prev.reasoningEffort,
      }));
      setSessions((prev) =>
        prev.map((s) => (s.id === currentSessionId ? { ...s, model: newModelId } : s))
      );
    },
    [currentSessionId, setSessions, setSettings]
  );

  return {
    sessions,
    currentSession,
    currentSessionId,
    settings,
    setSettings,
    isStreaming,
    sendMessage,
    stopStreaming,
    createNewSession,
    switchSession,
    deleteSession,
    renameSession,
    clearAllSessions,
    exportCurrentChat,
    changeModel,
  };
}
