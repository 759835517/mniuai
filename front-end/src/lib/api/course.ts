import { apiClient } from "@/lib/utils/apiClient";
import type { CourseSummary, CourseDetail, CourseProgress, PlayUrlResponse, ProgressSnapshot, HeartbeatRequest } from "@/lib/types/course";
import type { PageResponse, ID } from "@/lib/types/api";

export const courseApi = {
  list(category?: string, difficulty?: string, page = 0, size = 20): Promise<PageResponse<CourseSummary>> {
    return apiClient.get("/courses", { params: { category, difficulty, page, size } });
  },
  get(id: ID): Promise<CourseDetail> {
    return apiClient.get(`/courses/${id}`);
  },
  enroll(id: ID): Promise<void> {
    return apiClient.post(`/courses/${id}/enroll`);
  },
  getProgress(id: ID): Promise<CourseProgress> {
    return apiClient.get(`/courses/${id}/progress`);
  },
  getPlayUrl(lessonId: ID): Promise<PlayUrlResponse> {
    return apiClient.get(`/lessons/${lessonId}/play-url`);
  },
  sendHeartbeat(lessonId: ID, payload: HeartbeatRequest): Promise<ProgressSnapshot> {
    return apiClient.post(`/lessons/${lessonId}/heartbeat`, payload);
  },
  getLessonProgress(lessonId: ID): Promise<ProgressSnapshot> {
    return apiClient.get(`/lessons/${lessonId}/progress`);
  },
};
