import { apiClient } from "@/lib/utils/apiClient";
import type { LandingStats } from "@/lib/types/growth";

export const landingApi = {
  getStats(): Promise<LandingStats> {
    return apiClient.get("/landing/stats");
  },
};
