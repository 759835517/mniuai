"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/lib/stores/chatStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading";
import EmptyState from "@/components/shared/EmptyState";
import { MessagesSquare, Plus, Trash2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";

export default function CoachPage() {
  const router = useRouter();
  const { sessions, loadingSessions, fetchSessions, createSession, deleteSession } = useChatStore();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleNewSession = async () => {
    setCreating(true);
    try {
      const session = await createSession();
      router.push(`/coach/${session.id}`);
    } catch {
      // error in store
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI 教练</h1>
          <p className="mt-1 text-sm text-[#8B949E]">与 AI 对话，获得学习指导和问题解答</p>
        </div>
        <Button
          onClick={handleNewSession}
          disabled={creating}
          className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]"
        >
          <Plus className="mr-2 h-4 w-4" />
          新建会话
        </Button>
      </div>

      {loadingSessions && <Loading text="加载会话列表..." />}

      {!loadingSessions && sessions.length === 0 && (
        <EmptyState
          icon={MessagesSquare}
          title="还没有对话"
          description="点击上方按钮开始新的 AI 教练对话"
          actionLabel="开始对话"
          onAction={handleNewSession}
        />
      )}

      {!loadingSessions && sessions.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className="group cursor-pointer border-[#30363D] bg-[#161B22] p-4 transition-all hover:border-[#3B82F6]/30"
              onClick={() => router.push(`/coach/${session.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium">{session.title || "新对话"}</h3>
                  <p className="mt-1 text-xs text-[#8B949E]">
                    {formatRelativeTime(session.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="shrink-0 rounded p-1 text-[#484F58] opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
