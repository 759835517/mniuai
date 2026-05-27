import { create } from "zustand";
import type { LearningRoadmap, RoadmapProgress, RoadmapGenerateRequest, RoadmapTaskStatus } from "@/lib/types/roadmap";
import type { ID } from "@/lib/types/api";
import { roadmapApi } from "@/lib/api/roadmap";

export interface RoadmapState {
  activeRoadmap: LearningRoadmap | null;
  history: LearningRoadmap[];
  progress: RoadmapProgress | null;
  loading: boolean;
  generating: boolean;
  error: string | null;
  fetchActive: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  generate: (payload: RoadmapGenerateRequest) => Promise<LearningRoadmap>;
  fetchProgress: (roadmapId: ID) => Promise<void>;
  updateProgress: (roadmapId: ID, weekNumber: number, taskIndex: number, status: RoadmapTaskStatus) => Promise<void>;
  activate: (roadmapId: ID) => Promise<void>;
  reset: () => void;
}

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  activeRoadmap: null,
  history: [],
  progress: null,
  loading: false,
  generating: false,
  error: null,

  fetchActive: async () => {
    set({ loading: true, error: null });
    try {
      const roadmap = await roadmapApi.getActive();
      set({ activeRoadmap: roadmap, loading: false });
      if (roadmap) {
        get().fetchProgress(roadmap.id);
      }
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  fetchHistory: async () => {
    try {
      const res = await roadmapApi.getHistory();
      set({ history: res.items });
    } catch { /* ignore */ }
  },

  generate: async (payload) => {
    set({ generating: true, error: null });
    try {
      const roadmap = await roadmapApi.generate(payload);
      set({ activeRoadmap: roadmap, generating: false });
      await get().fetchProgress(roadmap.id);
      return roadmap;
    } catch (e) {
      set({ generating: false, error: (e as Error).message });
      throw e;
    }
  },

  fetchProgress: async (roadmapId) => {
    try {
      const progress = await roadmapApi.getProgress(roadmapId);
      set({ progress });
    } catch { /* ignore */ }
  },

  updateProgress: async (roadmapId, weekNumber, taskIndex, status) => {
    const prev = get().progress;
    if (prev) {
      const items = [...prev.items];
      const idx = items.findIndex(i => i.weekNumber === weekNumber && i.taskIndex === taskIndex);
      if (idx >= 0) {
        const existing = items[idx]!;
        items[idx] = { weekNumber: existing.weekNumber, taskIndex: existing.taskIndex, completedAt: existing.completedAt, status };
      } else {
        items.push({ weekNumber, taskIndex, status, completedAt: status === "COMPLETED" ? new Date().toISOString() : null });
      }
      const completedTasks = items.filter(i => i.status === "COMPLETED").length;
      set({ progress: { ...prev, items, completedTasks, completionRate: prev.totalTasks > 0 ? completedTasks / prev.totalTasks : 0 } });
    }
    try {
      await roadmapApi.updateProgress(roadmapId, { weekNumber, taskIndex, status });
    } catch (e) {
      set({ progress: prev, error: (e as Error).message });
    }
  },

  activate: async (roadmapId) => {
    try {
      await roadmapApi.activate(roadmapId);
      set({ activeRoadmap: get().history.find(r => r.id === roadmapId) ?? get().activeRoadmap });
      get().fetchHistory();
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  reset: () => set({ activeRoadmap: null, history: [], progress: null, loading: false, generating: false, error: null }),
}));
