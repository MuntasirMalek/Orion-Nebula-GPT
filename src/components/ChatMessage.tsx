import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "../types";
import { AstraLogo } from "./AstraLogo";
import { CodeBlock } from "./CodeBlock";
import { Copy, Check, User, AlertCircle } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  onRetry?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
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

  return (
    <div
      className={`group relative flex w-full my-2 transition-all ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex items-start gap-3.5 max-w-3xl rounded-2xl p-4 md:p-5 shadow-lg backdrop-blur-xl border ${
          isUser
            ? "bg-white/92 border-white/95 text-slate-900 shadow-slate-900/10"
            : "bg-white/85 border-white/80 text-slate-900 shadow-slate-900/15 w-full"
        }`}
      >
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 shadow-xs">
              <User className="w-4 h-4 text-slate-700" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white border border-cyan-200 flex items-center justify-center shadow-xs">
              <AstraLogo size={20} />
            </div>
          )}
        </div>

        {/* Content Box */}
        <div className="flex-1 min-w-0">
          {/* Header with Name & Actions */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wide text-slate-900">
                {isUser ? "You" : "Orion Nebula GPT"}
              </span>
              {!isUser && (
                <span className="text-[10px] text-cyan-900 font-mono font-bold bg-cyan-100/90 px-1.5 py-0.2 rounded border border-cyan-200">
                  Frontier
                </span>
              )}
              <span className="text-[11px] text-slate-500 font-medium">{formattedTime}</span>
            </div>

            {/* Copy button */}
            {message.content && !message.isStreaming && (
              <button
                onClick={handleCopyMessage}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-500 hover:text-slate-900"
                title="Copy message"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>

          {/* Main Message Body */}
          <div className="text-[15px] leading-relaxed text-slate-900 break-words font-medium">
            {isUser ? (
              <div className="whitespace-pre-wrap font-sans text-slate-900">
                {message.content}
              </div>
            ) : (
              <div className="prose max-w-none text-slate-900">
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
                          <code className="text-cyan-900 bg-cyan-50 px-1.5 py-0.5 rounded text-[13px] border border-cyan-200 font-mono font-semibold">
                            {children}
                          </code>
                        );
                      }

                      return (
                        <CodeBlock
                          language={match ? match[1] : ""}
                          code={String(children).replace(/\n$/, "")}
                        />
                      );
                    },
                    a(props) {
                      return (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-800 hover:text-cyan-950 underline underline-offset-4 font-bold"
                        />
                      );
                    },
                  }}
                >
                  {message.content}
                </Markdown>

                {/* Pulsing cursor while streaming */}
                {message.isStreaming && <span className="streaming-cursor" />}
              </div>
            )}

            {/* Error Card */}
            {message.error && (
              <div className="mt-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs flex items-start gap-2.5 shadow-sm">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-rose-900 mb-0.5">Connection Error</div>
                  <div className="text-rose-800 leading-relaxed font-medium">{message.error}</div>
                  <div className="mt-2 text-[11px] text-slate-600">
                    💡 Check that your backend proxy is running and configured with valid gateway credentials in Netlify or Settings.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
