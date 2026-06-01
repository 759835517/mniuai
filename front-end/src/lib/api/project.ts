import { apiClient } from "@/lib/utils/apiClient";
import type { Project, ProjectPlan, ProjectTask, ProjectType, ProjectStatus, TechStack } from "@/lib/types/project";
import type { PageResponse, ID } from "@/lib/types/api";

const BASE = "/projects";

type ProjectTaskResponse = Partial<ProjectTask> & Pick<ProjectTask, "id" | "title">;
type ProjectResponse = Partial<Omit<Project, "tasks" | "projectName" | "completionRate" | "plan">> & {
  id: ID;
  name?: string | null;
  projectName?: string | null;
  tasks?: ProjectTaskResponse[];
  completionRate?: number;
  projectCompletionRate?: number;
  plan?: Partial<ProjectPlan> | null;
  techStack?: TechStack | null;
};

function normalizePlan(plan?: Partial<ProjectPlan> | null): ProjectPlan {
  return {
    summary: plan?.summary ?? "",
    milestones: plan?.milestones ?? [],
    architectureMermaid: plan?.architectureMermaid,
    codeTemplates: plan?.codeTemplates,
    risks: plan?.risks,
  };
}

function normalizeTask(task: ProjectTaskResponse, index: number): ProjectTask {
  return {
    id: task.id,
    externalId: task.externalId ?? null,
    title: task.title,
    description: task.description ?? null,
    estimatedHours: task.estimatedHours ?? null,
    sortOrder: task.sortOrder ?? index,
    completed: task.completed ?? false,
    completedAt: task.completedAt ?? null,
  };
}

function completionRate(tasks: ProjectTask[]): number {
  if (tasks.length === 0) return 0;
  return tasks.filter((task) => task.completed).length / tasks.length;
}

function normalizeProject(raw: ProjectResponse): Project {
  const now = new Date().toISOString();
  const tasks = (raw.tasks ?? []).map(normalizeTask);
  const createdAt = raw.createdAt ?? raw.updatedAt ?? now;
  const updatedAt = raw.updatedAt ?? createdAt;
  const rawRate = raw.completionRate ?? raw.projectCompletionRate;
  const rate = rawRate == null ? completionRate(tasks) : rawRate > 1 ? rawRate / 100 : rawRate;

  return {
    id: raw.id,
    type: raw.type ?? "RAG",
    projectName: raw.projectName ?? raw.name ?? null,
    description: raw.description ?? null,
    status: raw.status ?? "ACTIVE",
    plan: normalizePlan(raw.plan),
    techStack: raw.techStack ?? null,
    tasks,
    completionRate: rate,
    createdAt,
    updatedAt,
  };
}

function normalizeProjectPage(page: PageResponse<ProjectResponse>): PageResponse<Project> {
  return {
    ...page,
    items: page.items.map(normalizeProject),
  };
}

export const projectApi = {
  async createProject(payload: { type: ProjectType; projectName?: string; description?: string }): Promise<Project> {
    const project = await apiClient.post<unknown, ProjectResponse>(BASE, payload);
    return normalizeProject(project);
  },
  async getProjects(params?: { status?: ProjectStatus; type?: ProjectType; page?: number; size?: number }): Promise<PageResponse<Project> | Project[]> {
    const projects = await apiClient.get<unknown, PageResponse<ProjectResponse> | ProjectResponse[]>(BASE, { params });
    return Array.isArray(projects) ? projects.map(normalizeProject) : normalizeProjectPage(projects);
  },
  async getProject(id: ID): Promise<Project> {
    const project = await apiClient.get<unknown, ProjectResponse>(`${BASE}/${id}`);
    return normalizeProject(project);
  },
  async updateProject(id: ID, payload: { projectName?: string; description?: string; status?: ProjectStatus }): Promise<Project> {
    const project = await apiClient.patch<unknown, ProjectResponse>(`${BASE}/${id}`, payload);
    return normalizeProject(project);
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
