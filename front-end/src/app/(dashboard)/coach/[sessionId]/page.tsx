"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChatStore } from "@/lib/stores/chatStore";
import { toast } from "sonner";
import SessionSidebar from "@/components/coach/SessionSidebar";
import ChatInterface from "@/components/coach/ChatInterface";

export default function CoachSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const {
    sessions,
    currentSession,
    messages,
    sending,
    loadingMessages,
    fetchSessions,
    selectSession,
    sendMessage,
    stopStreaming,
    deleteSession,
    createSession,
  } = useChatStore();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (sessionId) {
      selectSession(sessionId);
    }
  }, [sessionId, selectSession]);

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(sessionId, content);
    } catch {
      toast.error("发送失败");
    }
  };

  const handleNewSession = async () => {
    try {
      const session = await createSession();
      router.push(`/coach/${session.id}`);
    } catch {
      toast.error("创建会话失败");
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await deleteSession(id);
      toast.success("会话已删除");
    } catch {
      toast.error("删除失败");
    }
  };

  return (
    <div className="relative flex h-[calc(100dvh-10.5rem)] min-h-0 gap-0 overflow-hidden lg:h-[calc(100dvh-7rem)] lg:gap-4">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close session list"
          onClick={() => setSidebarOpen(false)}
          className="absolute inset-0 z-10 bg-[#0D1117]/60 lg:hidden"
        />
      )}

      <div
        className={`${
          sidebarOpen ? "translate-x-0 opacity-100 lg:w-64" : "-translate-x-full opacity-0 lg:w-0 lg:translate-x-0 lg:opacity-100"
        } absolute inset-y-0 left-0 z-20 w-64 shrink-0 overflow-hidden transition-all duration-200 lg:static lg:z-auto`}
      >
        <SessionSidebar
          sessions={sessions}
          currentSessionId={sessionId}
          onSelect={(id) => router.push(`/coach/${id}`)}
          onDelete={handleDeleteSession}
          onCreate={handleNewSession}
        />
      </div>

      <ChatInterface
        sessionId={sessionId}
        messages={messages}
        sending={sending}
        loadingMessages={loadingMessages}
        sessionTitle={currentSession?.title}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onSendMessage={handleSendMessage}
        onStopStreaming={stopStreaming}
      />
    </div>
  );
}
