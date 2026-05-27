import { create } from "zustand";
import type { ChatSession, ChatMessage, CreateSessionRequest } from "@/lib/types/coach";
import type { ID } from "@/lib/types/api";
import { coachApi } from "@/lib/api/coach";
import { postSse } from "@/lib/hooks/useSSE";

export interface ChatState {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  loadingSessions: boolean;
  loadingMessages: boolean;
  sending: boolean;
  error: string | null;
  abortController: AbortController | null;
  fetchSessions: () => Promise<void>;
  createSession: (payload?: CreateSessionRequest) => Promise<ChatSession>;
  deleteSession: (sessionId: ID) => Promise<void>;
  selectSession: (sessionId: ID) => Promise<void>;
  fetchMessages: (sessionId: ID) => Promise<void>;
  sendMessage: (sessionId: ID, content: string) => Promise<void>;
  stopStreaming: () => void;
  clearSession: (sessionId: ID) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  currentSession: null,
  messages: [],
  loadingSessions: false,
  loadingMessages: false,
  sending: false,
  error: null,
  abortController: null,

  fetchSessions: async () => {
    set({ loadingSessions: true });
    try {
      const res = await coachApi.getSessions();
      set({ sessions: res.items, loadingSessions: false });
    } catch (e) {
      set({ loadingSessions: false, error: (e as Error).message });
    }
  },

  createSession: async (payload) => {
    const session = await coachApi.createSession(payload);
    set((s) => ({ sessions: [session, ...s.sessions], currentSession: session, messages: [] }));
    return session;
  },

  deleteSession: async (sessionId) => {
    await coachApi.deleteSession(sessionId);
    set((s) => ({
      sessions: s.sessions.filter((ss) => ss.id !== sessionId),
      currentSession: s.currentSession?.id === sessionId ? null : s.currentSession,
      messages: s.currentSession?.id === sessionId ? [] : s.messages,
    }));
  },

  selectSession: async (sessionId) => {
    const session = get().sessions.find((s) => s.id === sessionId);
    if (session) {
      set({ currentSession: session });
      await get().fetchMessages(sessionId);
    }
  },

  fetchMessages: async (sessionId) => {
    set({ loadingMessages: true, messages: [] });
    try {
      const res = await coachApi.getMessages(sessionId);
      set({ messages: res.items, loadingMessages: false });
    } catch (e) {
      set({ loadingMessages: false, error: (e as Error).message });
    }
  },

  sendMessage: async (sessionId, content) => {
    const userMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sessionId,
      role: "USER",
      content,
      tokenCount: 0,
      createdAt: new Date().toISOString(),
    };
    const assistantMsg: ChatMessage = {
      id: `temp-asst-${Date.now()}`,
      sessionId,
      role: "ASSISTANT",
      content: "",
      tokenCount: 0,
      createdAt: new Date().toISOString(),
      streaming: true,
    };
    set((s) => ({
      messages: [...s.messages, userMsg, assistantMsg],
      sending: true,
      error: null,
    }));
    const controller = new AbortController();
    set({ abortController: controller });
    try {
      await postSse({
        url: coachApi.getMessageSseUrl(sessionId),
        body: { content },
        signal: controller.signal,
        onToken: (delta) => {
          set((s) => {
            const msgs = [...s.messages];
            const last = msgs[msgs.length - 1];
            if (last?.role === "ASSISTANT" && last.streaming) {
              msgs[msgs.length - 1] = { ...last, content: last.content + delta };
            }
            return { messages: msgs };
          });
        },
        onDone: (payload: unknown) => {
          const p = payload as { messageId?: ID } | undefined;
          set((s) => {
            const msgs = [...s.messages];
            const last = msgs[msgs.length - 1];
            if (last?.role === "ASSISTANT" && last.streaming) {
              msgs[msgs.length - 1] = { ...last, id: p?.messageId ?? last.id, streaming: false };
            }
            return { messages: msgs, sending: false, abortController: null };
          });
        },
        onError: (err) => {
          set((s) => {
            const msgs = [...s.messages];
            const last = msgs[msgs.length - 1];
            if (last?.role === "ASSISTANT" && last.streaming) {
              msgs[msgs.length - 1] = { ...last, streaming: false, failed: true, content: last.content || "生成失败" };
            }
            return { messages: msgs, sending: false, error: err.message, abortController: null };
          });
        },
      });
    } catch (e) {
      set({ sending: false, error: (e as Error).message, abortController: null });
    }
  },

  stopStreaming: () => {
    get().abortController?.abort();
    set((s) => {
      const msgs = [...s.messages];
      const last = msgs[msgs.length - 1];
      if (last?.role === "ASSISTANT" && last.streaming) {
        msgs[msgs.length - 1] = { ...last, streaming: false };
      }
      return { messages: msgs, sending: false, abortController: null };
    });
  },

  clearSession: async (sessionId) => {
    await coachApi.clearSession(sessionId);
    if (get().currentSession?.id === sessionId) {
      set({ messages: [] });
    }
  },
}));
