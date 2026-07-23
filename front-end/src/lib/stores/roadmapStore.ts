import { create } from "zustand";
import type { LearningRoadmap, RoadmapProgress, RoadmapGenerateRequest, RoadmapTaskStatus } from "@/lib/types/roadmap";
import { progressFromRoadmap, transformRoadmap } from "@/lib/types/roadmap";
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
      set({
        activeRoadmap: roadmap ? transformRoadmap(roadmap) : null,
        progress: roadmap ? progressFromRoadmap(roadmap) : null,
        loading: false,
      });
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
      set({ history: res.items.map(transformRoadmap) });
    } catch { /* ignore */ }
  },

  generate: async (payload) => {
    set({ generating: true, error: null });
    try {
      const roadmap = await roadmapApi.generate(payload);
      const transformed = transformRoadmap(roadmap);
      set({
        activeRoadmap: transformed,
        progress: progressFromRoadmap(roadmap),
        generating: false,
      });
      await get().fetchProgress(roadmap.id);
      return transformed;
    } catch (e) {
      set({ generating: false, error: (e as Error).message });
      throw e;
    }
  },

  fetchProgress: async (roadmapId) => {
    try {
      const raw = await roadmapApi.getProgress(roadmapId) as Partial<RoadmapProgress>;
      // Backend returns { roadmapId, totalTasks, completedTasks, completionPercent }
      // Normalize to frontend format: completionRate (0-1), items from backend status map
      const progress: RoadmapProgress = {
        roadmapId: raw.roadmapId ?? roadmapId,
        totalTasks: raw.totalTasks ?? 0,
        completedTasks: raw.completedTasks ?? 0,
        completionRate: raw.completionRate ?? (raw.completionPercent != null ? raw.completionPercent / 100 : 0),
        items: raw.items ?? [],
      };
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
      const roadmap = await roadmapApi.activate(roadmapId);
      const activeRoadmap = transformRoadmap(roadmap);
      set((state) => ({
        activeRoadmap,
        progress: progressFromRoadmap(roadmap),
        history: state.history.map((item) => ({ ...item, isActive: item.id === roadmapId })),
      }));
      await get().fetchProgress(roadmapId);
      await get().fetchHistory();
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  reset: () => set({ activeRoadmap: null, history: [], progress: null, loading: false, generating: false, error: null }),
}));
