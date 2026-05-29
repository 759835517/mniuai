import { create } from "zustand";
import type { Project, ProjectType, ProjectStatus } from "@/lib/types/project";
import type { ID } from "@/lib/types/api";
import { projectApi } from "@/lib/api/project";

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  creating: boolean;
  updatingTaskIds: string[];
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchProject: (id: ID) => Promise<void>;
  createProject: (payload: { type: ProjectType; projectName?: string; description?: string }) => Promise<Project>;
  updateProjectStatus: (id: ID, status: ProjectStatus) => Promise<void>;
  deleteProject: (id: ID) => Promise<void>;
  updateTask: (projectId: ID, taskId: ID, completed: boolean) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  loading: false,
  creating: false,
  updatingTaskIds: [],
  error: null,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const res = await projectApi.getProjects();
      // Backend may return array directly or PageResponse format
      const items = Array.isArray(res) ? res : (res?.items || []);
      set({ projects: items, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message, projects: [] });
    }
  },

  fetchProject: async (id) => {
    set({ loading: true });
    try {
      const project = await projectApi.getProject(id);
      set({ currentProject: project, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  createProject: async (payload) => {
    set({ creating: true, error: null });
    try {
      const project = await projectApi.createProject(payload);
      set((s) => ({ projects: [project, ...s.projects], creating: false }));
      return project;
    } catch (e) {
      set({ creating: false, error: (e as Error).message });
      throw e;
    }
  },

  updateProjectStatus: async (id, status) => {
    try {
      const updated = await projectApi.updateProject(id, { status });
      set((s) => ({
        projects: s.projects.map((p) => (p.id === id ? updated : p)),
        currentProject: s.currentProject?.id === id ? updated : s.currentProject,
      }));
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  deleteProject: async (id) => {
    try {
      await projectApi.deleteProject(id);
      set((s) => ({
        projects: s.projects.filter((p) => p.id !== id),
        currentProject: s.currentProject?.id === id ? null : s.currentProject,
      }));
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  updateTask: async (projectId, taskId, completed) => {
    const prev = get().currentProject;
    if (prev) {
      const tasks = prev.tasks.map((t) => (t.id === taskId ? { ...t, completed } : t));
      const completedCount = tasks.filter((t) => t.completed).length;
      set({
        currentProject: { ...prev, tasks, completionRate: tasks.length > 0 ? completedCount / tasks.length : 0 },
        updatingTaskIds: [...get().updatingTaskIds, taskId],
      });
    }
    try {
      const result = await projectApi.updateTask(projectId, taskId, completed);
      set((s) => ({
        updatingTaskIds: s.updatingTaskIds.filter((id) => id !== taskId),
        currentProject: s.currentProject ? { ...s.currentProject, completionRate: result.projectCompletionRate } : null,
      }));
    } catch (e) {
      set((s) => ({
        currentProject: prev,
        updatingTaskIds: s.updatingTaskIds.filter((id) => id !== taskId),
        error: (e as Error).message,
      }));
    }
  },
}));
