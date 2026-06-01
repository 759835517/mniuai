import { apiClient } from "@/lib/utils/apiClient";
import type { ChatSession, ChatMessage, ChatRole, CreateSessionRequest } from "@/lib/types/coach";
import type { PageResponse, ID } from "@/lib/types/api";

const BASE = "/coach";

type ChatSessionResponse = Partial<ChatSession> & Pick<ChatSession, "id">;
type ChatMessageResponse = Partial<Omit<ChatMessage, "role">> & Pick<ChatMessage, "id" | "content"> & {
  role?: string;
};

function normalizeRole(role?: string): ChatRole {
  const normalized = role?.toUpperCase();
  if (normalized === "USER" || normalized === "ASSISTANT" || normalized === "SYSTEM") {
    return normalized;
  }
  return "ASSISTANT";
}

function normalizeSession(session: ChatSessionResponse): ChatSession {
  const fallbackTime = session.updatedAt ?? session.createdAt ?? new Date().toISOString();

  return {
    id: session.id,
    title: session.title ?? null,
    contextType: session.contextType ?? "GENERAL",
    contextId: session.contextId ?? null,
    createdAt: session.createdAt ?? fallbackTime,
    updatedAt: fallbackTime,
  };
}

function normalizeSessionPage(page: PageResponse<ChatSessionResponse>): PageResponse<ChatSession> {
  return {
    ...page,
    items: page.items.map(normalizeSession),
  };
}

function normalizeMessage(message: ChatMessageResponse, sessionId: ID): ChatMessage {
  return {
    id: message.id,
    sessionId: message.sessionId ?? sessionId,
    role: normalizeRole(message.role),
    content: message.content,
    tokenCount: message.tokenCount ?? 0,
    createdAt: message.createdAt ?? new Date().toISOString(),
    streaming: message.streaming,
    failed: message.failed,
  };
}

function normalizeMessagePage(page: PageResponse<ChatMessageResponse>, sessionId: ID): PageResponse<ChatMessage> {
  return {
    ...page,
    items: page.items.map((message) => normalizeMessage(message, sessionId)),
  };
}

export const coachApi = {
  async createSession(payload?: CreateSessionRequest): Promise<ChatSession> {
    const session = await apiClient.post<unknown, ChatSessionResponse>(`${BASE}/sessions`, payload ?? {});
    return normalizeSession(session);
  },
  async getSessions(page = 0, size = 50): Promise<PageResponse<ChatSession>> {
    const sessions = await apiClient.get<unknown, PageResponse<ChatSessionResponse>>(`${BASE}/sessions`, { params: { page, size } });
    return normalizeSessionPage(sessions);
  },
  deleteSession(id: ID): Promise<{ deleted: boolean }> {
    return apiClient.delete(`${BASE}/sessions/${id}`);
  },
  async getMessages(id: ID, page = 0, size = 50): Promise<PageResponse<ChatMessage>> {
    const messages = await apiClient.get<unknown, PageResponse<ChatMessageResponse>>(`${BASE}/sessions/${id}/messages`, { params: { page, size } });
    return normalizeMessagePage(messages, id);
  },
  clearSession(id: ID): Promise<{ sessionId: ID; cleared: boolean }> {
    return apiClient.post(`${BASE}/sessions/${id}/clear`);
  },
  getMessageSseUrl(id: ID): string {
    const directApiBase = process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api/v1`
      : undefined;
    const basePath = (
      process.env.NEXT_PUBLIC_SSE_BASE_PATH ||
      directApiBase ||
      process.env.NEXT_PUBLIC_API_BASE_PATH ||
      "/api/backend"
    ).replace(/\/$/, "");
    return `${basePath}/coach/sessions/${id}/messages/stream`;
  },
};
