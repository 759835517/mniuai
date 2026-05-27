"use client";

import { Copy, Check } from "lucide-react";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";
import type { ChatMessage } from "@/lib/types/coach";
import { useState } from "react";

interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: (message: ChatMessage) => void;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "USER";
  const isAssistant = message.role === "ASSISTANT";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`group flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-[#3B82F6] text-white"
            : "border border-[#30363D] bg-[#0D1117]"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
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
    </div>
  );
}
