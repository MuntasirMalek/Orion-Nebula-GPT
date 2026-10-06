import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "../types";
import { ThemeConfig } from "../themes";
import { AstraLogo } from "./AstraLogo";
import { CodeBlock } from "./CodeBlock";
import { Copy, Check, User, AlertCircle } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  theme: ThemeConfig;
  index?: number;
  onRetry?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, theme, index = 0 }) => {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const entryNumber = String(index + 1).padStart(2, "0");

  return (
    <div
      className={`group relative flex w-full my-2 transition-all ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`relative flex items-start gap-3.5 transition-all duration-300 ${
          isUser ? theme.message.userContainer : theme.message.assistantContainer
        }`}
      >
        {/* HUD Corner Reticles (Only in HUD mode) */}
        {theme.message.cornerBrackets && (
          <>
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-cyan-400 pointer-events-none" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-cyan-400 pointer-events-none" />
            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-cyan-400 pointer-events-none" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-cyan-400 pointer-events-none" />
          </>
        )}

        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className={theme.message.userAvatar}>
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div className={theme.message.assistantAvatar}>
              <AstraLogo size={20} />
            </div>
          )}
        </div>

        {/* Content Box */}
        <div className="flex-1 min-w-0">
          {/* Header with Name & Actions */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {/* Optional Editorial Entry Index */}
              {theme.message.entryNumberPrefix && (
                <span className="text-xs font-mono font-semibold text-stone-500 uppercase tracking-widest">
                  #{entryNumber} ·
                </span>
              )}

              <span className={isUser ? theme.message.authorTextUser : theme.message.authorTextAssistant}>
                {isUser ? "You" : "Orion Nebula GPT"}
              </span>

              {!isUser && (
                <span className={theme.message.badge}>
                  Frontier
                </span>
              )}

              <span className={theme.message.timestamp}>{formattedTime}</span>
            </div>

            {/* Copy button */}
            {message.content && !message.isStreaming && (
              <button
                onClick={handleCopyMessage}
                className={theme.message.copyButton}
                title="Copy message"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>

          {/* Main Message Body */}
          <div className={isUser ? theme.message.bodyTextUser : theme.message.bodyTextAssistant}>
            {isUser ? (
              <div className="whitespace-pre-wrap">
                {message.content}
              </div>
            ) : (
              <div className="prose max-w-none">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Custom Code Block component override
                    code(props) {
                      const { className, children } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      const isInline = !match && !String(children).includes("\n");

                      if (isInline) {
                        return (
                          <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                            {children}
                          </code>
                        );
                      }

                      return (
                        <CodeBlock
                          language={match ? match[1] : "text"}
                          code={String(children).replace(/\n$/, "")}
                        />
                      );
                    },
                    p({ children }) {
                      return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
                    },
                    ul({ children }) {
                      return <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>;
                    },
                    ol({ children }) {
                      return <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>;
                    },
                    li({ children }) {
                      return <li className="leading-relaxed">{children}</li>;
                    },
                    h1({ children }) {
                      return <h1 className="text-lg font-bold tracking-tight mt-4 mb-2">{children}</h1>;
                    },
                    h2({ children }) {
                      return <h2 className="text-base font-bold tracking-tight mt-3 mb-2">{children}</h2>;
                    },
                    h3({ children }) {
                      return <h3 className="text-sm font-semibold tracking-tight mt-2 mb-1">{children}</h3>;
                    },
                    blockquote({ children }) {
                      return (
                        <blockquote className="border-l-2 border-cyan-500/50 pl-3 italic my-2 opacity-90">
                          {children}
                        </blockquote>
                      );
                    },
                  }}
                >
                  {message.content}
                </Markdown>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {message.error && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{message.error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
