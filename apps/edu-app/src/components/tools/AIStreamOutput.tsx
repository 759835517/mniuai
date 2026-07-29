"use client";

import { useEffect, useRef } from "react";

interface AIStreamOutputProps {
  content: string;
  isStreaming: boolean;
  isEmpty: boolean;
  emptyText?: string;
  onCopy?: () => void;
  onSave?: () => void;
  onExport?: (format: "word" | "pdf") => void;
  onRegenerate?: () => void;
}

export function AIStreamOutput({
  content,
  isStreaming,
  isEmpty,
  emptyText = "填写左侧参数后点击生成",
  onCopy,
  onSave,
  onExport,
  onRegenerate,
}: AIStreamOutputProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStreaming) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [content, isStreaming]);

  if (isEmpty && !isStreaming) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
        <div className="text-5xl mb-4">🤖</div>
        <p className="text-gray-400 text-sm">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 工具栏 */}
      {!isEmpty && !isStreaming && (
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              🔄 重新生成
            </button>
          )}
          {onCopy && (
            <button
              onClick={onCopy}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              📋 复制
            </button>
          )}
          {onSave && (
            <button
              onClick={onSave}
              className="flex items-center gap-1 text-xs text-white bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              💾 保存到库
            </button>
          )}
          {onExport && (
            <div className="relative group ml-auto">
              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                📤 导出 ▾
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={() => onExport("word")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg"
                >
                  Word (.docx)
                </button>
                <button
                  onClick={() => onExport("pdf")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 last:rounded-b-lg"
                >
                  PDF
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 内容区 */}
      <div className="flex-1 overflow-auto">
        {isStreaming && content === "" ? (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
            <span className="text-sm">AI正在生成中...</span>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
              {content}
              {isStreaming && (
                <span className="inline-block w-0.5 h-4 bg-orange-400 animate-pulse ml-0.5 align-middle" />
              )}
            </pre>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {isStreaming && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          正在生成，请稍候...
        </div>
      )}
    </div>
  );
}
