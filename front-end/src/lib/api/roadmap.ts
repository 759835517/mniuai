import { apiClient } from "@/lib/utils/apiClient";
import type { LearningRoadmap, RoadmapGenerateRequest, RoadmapProgress } from "@/lib/types/roadmap";
import type { PageResponse, ID } from "@/lib/types/api";

export const roadmapApi = {
  generate(payload: RoadmapGenerateRequest): Promise<LearningRoadmap> {
    return apiClient.post("/roadmaps/generate", {
      currentSkills: payload.skills,
      learningGoal: payload.goal,
      availableHoursPerWeek: payload.hours,
      durationWeeks: payload.durationWeeks,
    });
  },
  getActive(): Promise<LearningRoadmap | null> {
    return apiClient.get("/roadmaps/active");
  },
  getHistory(page = 0, size = 20): Promise<PageResponse<LearningRoadmap>> {
    return apiClient.get("/roadmaps/history", { params: { page, size } });
  },
  regenerate(id: ID, overrides?: Record<string, unknown>): Promise<LearningRoadmap> {
    return apiClient.post(`/roadmaps/${id}/regenerate`, overrides);
  },
  activate(id: ID): Promise<{ id: ID; isActive: boolean }> {
    return apiClient.patch(`/roadmaps/${id}/activate`);
  },
  getProgress(id: ID): Promise<RoadmapProgress> {
    return apiClient.get(`/roadmaps/${id}/progress`);
  },
  updateProgress(id: ID, payload: { weekNumber: number; taskIndex: number; status: string }) {
    return apiClient.put(`/roadmaps/${id}/progress`, {
      week_number: payload.weekNumber,
      task_index: payload.taskIndex,
      status: payload.status,
    });
  },
};
