import React, { useRef, useEffect, useState } from "react";
import { Message } from "../types";
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
      {/* Top Bar Header - Translucent Glass */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-14 md:h-16 bg-white/30 backdrop-blur-xl border-b border-white/30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-800 hover:text-slate-950 hover:bg-white/40 transition-colors active:scale-95"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <AstraLogo size={24} />
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-slate-900 drop-shadow-xs">
                Orion Nebula GPT
              </span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-400" />
              <div className="hidden sm:flex items-center">
                <ModelStatusBadge
                  currentModelId={currentModelId}
                  onSelectModel={onSelectModel}
                  isStreaming={isStreaming}
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
            />
          </div>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-black hover:bg-white/50 border border-transparent hover:border-white/40 transition-all duration-150 active:scale-95"
            title="Settings"
          >
            <SettingsIcon className="w-5 h-5 text-black stroke-[2.2]" />
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
          /* Empty State: Center card removed as requested. Full unobstructed view of the wallpaper! */
          <div className="flex-1" />
        ) : (
          /* Active Chat Messages Stream */
          <div className="flex-1 py-6 px-4 max-w-4xl mx-auto w-full space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={bottomAnchorRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 z-20 flex items-center justify-center p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-white text-cyan-800 hover:text-cyan-950 hover:bg-white transition-all duration-200 shadow-xl active:scale-95"
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
      />
    </div>
  );
};
