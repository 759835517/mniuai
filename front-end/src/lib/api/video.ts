import { apiClient } from "@/lib/utils/apiClient";
import type { PlayUrlResponse, ProgressSnapshot, HeartbeatRequest } from "@/lib/types/video";
import type { ID } from "@/lib/types/api";

export const videoApi = {
  getPlayUrl(lessonId: ID): Promise<PlayUrlResponse> {
    return apiClient.get(`/lessons/${lessonId}/play-url`);
  },
  heartbeat(lessonId: ID, payload: HeartbeatRequest): Promise<ProgressSnapshot> {
    return apiClient.post(`/lessons/${lessonId}/heartbeat`, payload);
  },
  getProgress(lessonId: ID): Promise<ProgressSnapshot> {
    return apiClient.get(`/lessons/${lessonId}/progress`);
  },
};
