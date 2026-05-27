import { useAuthStore } from "@/lib/stores/authStore";
import { useChatStore } from "@/lib/stores/chatStore";

export function useChat() {
  const { user } = useAuthStore();
  const store = useChatStore();

  return {
    user,
    sessions: store.sessions,
    currentSession: store.currentSession,
    messages: store.messages,
    sending: store.sending,
    loadingMessages: store.loadingMessages,
    error: store.error,
    fetchSessions: store.fetchSessions,
    createSession: store.createSession,
    deleteSession: store.deleteSession,
    selectSession: store.selectSession,
    sendMessage: store.sendMessage,
    stopStreaming: store.stopStreaming,
    clearSession: store.clearSession,
  };
}
