import { apiClient } from "@/lib/utils/apiClient";
import type { CourseSummary, CourseDetail, CourseProgress, PlayUrlResponse, ProgressSnapshot, HeartbeatRequest, CourseCreateRequest, LessonCreateRequest, Lesson } from "@/lib/types/course";
import type { PageResponse, ID } from "@/lib/types/api";

export const courseApi = {
  // ========== 前台 ==========
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

  // ========== 后台管理 ==========
  adminList(status?: string, category?: string, page = 0, size = 20): Promise<PageResponse<CourseSummary>> {
    return apiClient.get("/admin/courses", { params: { status, category, page, size } });
  },
  adminGet(id: ID): Promise<CourseSummary> {
    return apiClient.get(`/admin/courses/${id}`);
  },
  adminCreate(payload: CourseCreateRequest): Promise<CourseSummary> {
    return apiClient.post("/admin/courses", payload);
  },
  adminUpdate(id: ID, payload: CourseCreateRequest): Promise<CourseSummary> {
    return apiClient.put(`/admin/courses/${id}`, payload);
  },
  adminDelete(id: ID): Promise<void> {
    return apiClient.delete(`/admin/courses/${id}`);
  },
  adminListLessons(courseId: ID): Promise<Lesson[]> {
    return apiClient.get(`/admin/courses/${courseId}/lessons`);
  },
  adminCreateLesson(courseId: ID, payload: LessonCreateRequest): Promise<void> {
    return apiClient.post(`/admin/courses/${courseId}/lessons`, payload);
  },
  adminUpdateLesson(lessonId: ID, payload: LessonCreateRequest): Promise<void> {
    return apiClient.put(`/admin/courses/lessons/${lessonId}`, payload);
  },
  adminDeleteLesson(lessonId: ID): Promise<void> {
    return apiClient.delete(`/admin/courses/lessons/${lessonId}`);
  },
};
