import { apiClient } from "@/lib/utils/apiClient";
import type { GrowthProfile, Achievement, ActivityLog, GrowthStats } from "@/lib/types/growth";
import type { PageResponse } from "@/lib/types/api";

const BASE = "/growth";

export const growthApi = {
  getProfile(): Promise<GrowthProfile> {
    return apiClient.get(`${BASE}/profile`);
  },
  getAchievements(): Promise<Achievement[]> {
    return apiClient.get(`${BASE}/achievements`);
  },
  getActivities(page = 0, size = 20, activityType?: string): Promise<PageResponse<ActivityLog>> {
    return apiClient.get(`${BASE}/activities`, { params: { page, size, activityType } });
  },
  getStats(): Promise<GrowthStats> {
    return apiClient.get(`${BASE}/stats`);
  },
};
