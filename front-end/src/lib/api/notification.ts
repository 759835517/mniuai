import { apiClient } from "@/lib/utils/apiClient";
import type { NotificationItem } from "@/lib/types/growth";
import type { PageResponse, ID } from "@/lib/types/api";

const BASE = "/notifications";

export const notificationApi = {
  getNotifications(page = 0, size = 20, unreadOnly = false): Promise<PageResponse<NotificationItem>> {
    return apiClient.get(BASE, { params: { page, size, unreadOnly } });
  },
  markRead(id: ID): Promise<{ id: ID; isRead: boolean }> {
    return apiClient.put(`${BASE}/${id}/read`);
  },
  markAllRead(): Promise<{ updatedCount: number }> {
    return apiClient.put(`${BASE}/read-all`);
  },
  getUnreadCount(): Promise<{ count: number }> {
    return apiClient.get(`${BASE}/unread-count`);
  },
};
