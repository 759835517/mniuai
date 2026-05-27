import { apiClient } from "@/lib/utils/apiClient";
import type { ChatSession, ChatMessage, CreateSessionRequest } from "@/lib/types/coach";
import type { PageResponse, ID } from "@/lib/types/api";

const BASE = "/coach";

export const coachApi = {
  createSession(payload?: CreateSessionRequest): Promise<ChatSession> {
    return apiClient.post(`${BASE}/sessions`, payload ?? {});
  },
  getSessions(page = 0, size = 50): Promise<PageResponse<ChatSession>> {
    return apiClient.get(`${BASE}/sessions`, { params: { page, size } });
  },
  deleteSession(id: ID): Promise<{ deleted: boolean }> {
    return apiClient.delete(`${BASE}/sessions/${id}`);
  },
  getMessages(id: ID, page = 0, size = 50): Promise<PageResponse<ChatMessage>> {
    return apiClient.get(`${BASE}/sessions/${id}/messages`, { params: { page, size } });
  },
  clearSession(id: ID): Promise<{ sessionId: ID; cleared: boolean }> {
    return apiClient.post(`${BASE}/sessions/${id}/clear`);
  },
  getMessageSseUrl(id: ID): string {
    const basePath = process.env.NEXT_PUBLIC_API_BASE_PATH || "/api/backend";
    return `${basePath}/coach/sessions/${id}/messages`;
  },
};
