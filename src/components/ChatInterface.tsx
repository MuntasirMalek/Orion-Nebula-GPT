import React, { useRef, useEffect, useState } from "react";
import { Message } from "../types";
import { ThemeConfig } from "../themes";
import { AstraLogo } from "./AstraLogo";
import { ModelStatusBadge } from "./ModelStatusBadge";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import {
  Menu,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ChatInterfaceProps {
  messages: Message[];
  isStreaming: boolean;
  currentModelId: string;
  onSelectModel: (modelId: string) => void;
  reasoningEffort?: "low" | "medium" | "high";
  onSelectReasoningEffort?: (effort: "low" | "medium" | "high") => void;
  onSendMessage: (text: string, images?: string[]) => void;
  onStopStreaming: () => void;
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  sendKeyMode?: "enter" | "cmd_enter";
  theme: ThemeConfig;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isStreaming,
  currentModelId,
  onSelectModel,
  reasoningEffort = "medium",
  onSelectReasoningEffort,
  onSendMessage,
  onStopStreaming,
  onToggleSidebar,
  onOpenSettings,
  sendKeyMode = "enter",
  theme,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const userScrolledUpRef = useRef(false);

  // Instant zero-overhead auto-scroll handler
  useEffect(() => {
    if (!userScrolledUpRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const rafId = requestAnimationFrame(() => {
        if (!userScrolledUpRef.current && container) {
          container.scrollTop = container.scrollHeight;
        }
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [messages, isStreaming]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceToBottom > 120) {
      setShowScrollBottom(true);
      userScrolledUpRef.current = true;
    } else {
      setShowScrollBottom(false);
      userScrolledUpRef.current = false;
    }

    if (scrollTop > 150) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const scrollToTop = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    userScrolledUpRef.current = false;
    bottomAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBottom(false);
  };

  return (
    <div className="relative flex flex-col flex-1 h-full min-w-0 bg-transparent overflow-hidden">
      {/* Top Bar Header */}
      <header className={`sticky top-0 z-30 flex items-center justify-between px-2.5 sm:px-6 h-14 md:h-16 w-full max-w-full transition-colors duration-300 ${theme.header.container}`}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-1.5 sm:mr-2">
          <button
            onClick={onToggleSidebar}
            className={`shrink-0 ${theme.header.button}`}
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="shrink-0">
              <AstraLogo size={22} />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className={`truncate text-xs sm:text-sm font-bold sm:font-semibold ${theme.header.brandText}`}>
                Orion Nebula GPT
              </span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full opacity-40 bg-current shrink-0" />
              <div className="hidden sm:flex items-center">
                <ModelStatusBadge
                  currentModelId={currentModelId}
                  onSelectModel={onSelectModel}
                  isStreaming={isStreaming}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Mobile Model Status Selector */}
          <div className="sm:hidden">
            <ModelStatusBadge
              currentModelId={currentModelId}
              onSelectModel={onSelectModel}
              isStreaming={isStreaming}
              theme={theme}
            />
          </div>

          <button
            onClick={onOpenSettings}
            className={`shrink-0 ${theme.header.button}`}
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Conversation Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col"
      >
        {messages.length === 0 ? (
          /* Empty State: Full unobstructed view of the wallpaper */
          <div className="flex-1" />
        ) : (
          /* Active Chat Messages Stream */
          <div className="flex-1 py-6 px-4 max-w-4xl mx-auto w-full space-y-4">
            {messages.map((message, idx) => (
              <ChatMessage
                key={message.id}
                message={message}
                theme={theme}
                index={idx}
              />
            ))}
            <div ref={bottomAnchorRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Floating Scroll Navigation Controls */}
      <div className="absolute bottom-24 right-4 sm:right-6 z-20 flex flex-col items-center gap-2 pointer-events-none">
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200/90 dark:border-stone-700/80 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center cursor-pointer pointer-events-auto group"
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5 shrink-0 block transition-transform group-hover:-translate-y-0.5" strokeWidth={2.5} />
          </button>
        )}

        {showScrollBottom && (
          <button
            type="button"
            onClick={scrollToBottom}
            className="w-10 h-10 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200/90 dark:border-stone-700/80 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center cursor-pointer pointer-events-auto group"
            title="Scroll to bottom"
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="w-5 h-5 shrink-0 block transition-transform group-hover:translate-y-0.5" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        onSendMessage={onSendMessage}
        onStopStreaming={onStopStreaming}
        isStreaming={isStreaming}
        currentModelId={currentModelId}
        onSelectModel={onSelectModel}
        reasoningEffort={reasoningEffort}
        onSelectReasoningEffort={onSelectReasoningEffort}
        sendKeyMode={sendKeyMode}
        theme={theme}
      />
    </div>
  );
};
