import { apiClient } from "@/lib/utils/apiClient";
import type { Project, ProjectType, ProjectStatus } from "@/lib/types/project";
import type { PageResponse, ID } from "@/lib/types/api";

const BASE = "/projects";

export const projectApi = {
  createProject(payload: { type: ProjectType; projectName?: string; description?: string }): Promise<Project> {
    return apiClient.post(BASE, payload);
  },
  getProjects(params?: { status?: ProjectStatus; type?: ProjectType; page?: number; size?: number }): Promise<PageResponse<Project>> {
    return apiClient.get(BASE, { params });
  },
  getProject(id: ID): Promise<Project> {
    return apiClient.get(`${BASE}/${id}`);
  },
  updateProject(id: ID, payload: { projectName?: string; description?: string; status?: ProjectStatus }): Promise<Project> {
    return apiClient.patch(`${BASE}/${id}`, payload);
  },
  deleteProject(id: ID): Promise<{ deleted: boolean }> {
    return apiClient.delete(`${BASE}/${id}`);
  },
  updateTask(projectId: ID, taskId: ID, completed: boolean): Promise<{ taskId: ID; completed: boolean; completedAt: string; projectCompletionRate: number }> {
    return apiClient.patch(`${BASE}/${projectId}/tasks/${taskId}`, { completed });
  },
  createDiscussSession(projectId: ID): Promise<{ sessionId: ID; redirectUrl: string }> {
    return apiClient.post(`${BASE}/${projectId}/discuss`);
  },
};
