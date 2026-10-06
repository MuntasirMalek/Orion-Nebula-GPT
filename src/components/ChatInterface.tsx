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
} from "lucide-react";

interface ChatInterfaceProps {
  messages: Message[];
  isStreaming: boolean;
  currentModelId: string;
  onSelectModel: (modelId: string) => void;
  onSendMessage: (text: string) => void;
  onStopStreaming: () => void;
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  theme: ThemeConfig;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isStreaming,
  currentModelId,
  onSelectModel,
  onSendMessage,
  onStopStreaming,
  onToggleSidebar,
  onOpenSettings,
  theme,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const userScrolledUpRef = useRef(false);

  // Auto-scroll handler
  useEffect(() => {
    if (!userScrolledUpRef.current) {
      bottomAnchorRef.current?.scrollIntoView({ behavior: isStreaming ? "auto" : "smooth" });
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
  };

  const scrollToBottom = () => {
    userScrolledUpRef.current = false;
    bottomAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBottom(false);
  };

  return (
    <div className="relative flex flex-col flex-1 h-full min-w-0 bg-transparent overflow-hidden">
      {/* Top Bar Header */}
      <header className={`sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-14 md:h-16 transition-colors duration-300 ${theme.header.container}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className={theme.header.button}
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <AstraLogo size={24} />
            <div className="flex items-center gap-2">
              <span className={theme.header.brandText}>
                Orion Nebula GPT
              </span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full opacity-40 bg-current" />
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
        <div className="flex items-center gap-2">
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
            className={theme.header.button}
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

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 z-20 flex items-center justify-center p-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/50 text-cyan-600 dark:text-cyan-400 shadow-xl active:scale-95 transition-all"
          title="Scroll to bottom"
        >
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      )}

      {/* Input Area */}
      <ChatInput
        onSendMessage={onSendMessage}
        onStopStreaming={onStopStreaming}
        isStreaming={isStreaming}
        currentModelId={currentModelId}
        onSelectModel={onSelectModel}
        theme={theme}
      />
    </div>
  );
};
