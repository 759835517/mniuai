import { create } from "zustand";
import type { NotificationItem, Achievement } from "@/lib/types/growth";
import { notificationApi } from "@/lib/api/notification";
import type { ID } from "@/lib/types/api";

export interface UiState {
  sidebarOpen: boolean;
  notifications: NotificationItem[];
  unreadCount: number;
  achievementModal: Achievement | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markNotificationRead: (id: ID) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  showAchievement: (achievement: Achievement) => void;
  closeAchievementModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  notifications: [],
  unreadCount: 0,
  achievementModal: null,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  fetchNotifications: async () => {
    try {
      const res = await notificationApi.getNotifications();
      set({ notifications: res.items });
    } catch { /* ignore */ }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      set({ unreadCount: res.count });
    } catch { /* ignore */ }
  },

  markNotificationRead: async (id) => {
    try {
      await notificationApi.markRead(id);
      set((s) => ({
        notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        unreadCount: Math.max(0, s.unreadCount - 1),
      }));
    } catch { /* ignore */ }
  },

  markAllNotificationsRead: async () => {
    try {
      await notificationApi.markAllRead();
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch { /* ignore */ }
  },

  showAchievement: (achievement) => set({ achievementModal: achievement }),
  closeAchievementModal: () => set({ achievementModal: null }),
}));
