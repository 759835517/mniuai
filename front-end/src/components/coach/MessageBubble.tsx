"use client";

import { Bot, Check, Copy, User } from "lucide-react";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";
import type { ChatMessage } from "@/lib/types/coach";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: (message: ChatMessage) => void;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const role = message.role.toUpperCase();
  const isUser = role === "USER";
  const isAssistant = role === "ASSISTANT";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("group flex w-full gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#30363D] bg-[#1C2128] text-[#8B5CF6]">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={`relative max-w-[82%] rounded-lg px-4 py-3 shadow-sm sm:max-w-[76%] ${
          isUser
            ? "rounded-br-sm bg-[#2563EB] text-white"
            : "rounded-bl-sm border border-[#30363D] bg-[#0D1117] text-[#F0F6FC]"
        }`}
      >
        <div
          className={cn(
            "mb-1 text-[11px] font-medium leading-none",
            isUser ? "text-blue-100" : "text-[#8B949E]"
          )}
        >
          {isUser ? "我" : "AI 教练"}
        </div>

        {isUser ? (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.content}</p>
        ) : (
          <>
            <MarkdownRenderer content={message.content || (message.streaming ? "思考中..." : "")} />
            {message.streaming && message.content && (
              <span className="ml-0.5 inline-block h-4 w-1 animate-pulse-caret bg-[#3B82F6]" />
            )}
          </>
        )}

        {message.failed && (
          <p className="mt-2 text-xs text-red-400">生成已停止</p>
        )}

        {/* Copy button for assistant */}
        {isAssistant && !message.streaming && message.content && (
          <button
            onClick={handleCopy}
            className="absolute -right-8 top-0 hidden rounded p-1 text-[#484F58] hover:text-[#F0F6FC] group-hover:block"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
