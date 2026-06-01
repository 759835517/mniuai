"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChatSession } from "@/lib/types/coach";

interface SessionSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelect: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
  onCreate: () => void;
}

export default function SessionSidebar({
  sessions,
  currentSessionId,
  onSelect,
  onDelete,
  onCreate,
}: SessionSidebarProps) {
  return (
    <div className="flex h-full w-64 flex-col overflow-hidden rounded-lg border border-[#30363D] bg-[#161B22]">
      <div className="flex items-center justify-between border-b border-[#30363D] p-3">
        <span className="text-sm font-medium">会话列表</span>
        <Button variant="ghost" size="icon" onClick={onCreate} className="h-7 w-7">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="mniu-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onSelect(session.id)}
            className={`group flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
              session.id === currentSessionId
                ? "bg-[#3B82F6]/10 text-[#3B82F6]"
                : "text-[#8B949E] hover:bg-[#1C2128]"
            }`}
          >
            <span className="flex-1 truncate">{session.title || "新对话"}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(session.id);
              }}
              className="ml-1 shrink-0 rounded p-0.5 text-[#484F58] opacity-0 hover:text-red-400 group-hover:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {sessions.length === 0 && (
          <div className="py-8 text-center text-xs text-[#484F58]">暂无会话</div>
        )}
      </div>
    </div>
  );
}
