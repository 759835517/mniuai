"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Square, PanelLeftClose, PanelLeft, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading";
import MessageBubble from "./MessageBubble";
import type { ChatMessage } from "@/lib/types/coach";

interface ChatInterfaceProps {
  sessionId: string;
  messages: ChatMessage[];
  sending: boolean;
  loadingMessages: boolean;
  sessionTitle?: string | null;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onSendMessage: (content: string) => Promise<void>;
  onStopStreaming: () => void;
}

export default function ChatInterface({
  messages,
  sending,
  loadingMessages,
  sessionTitle,
  sidebarOpen,
  onToggleSidebar,
  onSendMessage,
  onStopStreaming,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setInput("");
    await onSendMessage(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setIsAtBottom(atBottom);
  };

  useEffect(() => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAtBottom]);

  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-lg border border-[#30363D] bg-[#161B22]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[#30363D] px-4 py-3">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="h-8 w-8">
          {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
        </Button>
        <h2 className="flex-1 truncate text-sm font-medium">{sessionTitle || "AI 教练"}</h2>
      </div>

      {/* Messages */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 py-6">
        {loadingMessages && <Loading text="加载消息..." />}

        {!loadingMessages && messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <MessagesSquare className="mb-4 h-12 w-12 text-[#30363D]" />
            <p className="text-sm text-[#8B949E]">开始对话吧</p>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[#30363D] px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
            rows={1}
            className="flex-1 resize-none rounded-md border border-[#30363D] bg-[#0D1117] px-3 py-2 text-sm text-[#F0F6FC] placeholder:text-[#484F58] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
            style={{ maxHeight: 120 }}
          />
          {sending ? (
            <Button
              variant="outline"
              size="icon"
              onClick={onStopStreaming}
              className="shrink-0 border-[#30363D] hover:bg-red-500/10 hover:text-red-400"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim()}
              className="shrink-0 bg-[#3B82F6]"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
