import { create } from "zustand";
import type { CourseSummary, CourseDetail, CourseProgress, PlayUrlResponse, ProgressSnapshot } from "@/lib/types/course";
import { courseApi } from "@/lib/api/course";
import type { ID } from "@/lib/types/api";

export interface CourseState {
  courses: CourseSummary[];
  currentCourse: CourseDetail | null;
  courseProgress: CourseProgress | null;
  playUrl: PlayUrlResponse | null;
  lessonProgress: ProgressSnapshot | null;
  loading: boolean;
  error: string | null;
  listCourses: (category?: string, difficulty?: string) => Promise<void>;
  fetchCourse: (id: ID) => Promise<void>;
  enroll: (id: ID) => Promise<void>;
  fetchCourseProgress: (id: ID) => Promise<void>;
  fetchPlayUrl: (lessonId: ID) => Promise<void>;
  sendHeartbeat: (lessonId: ID, positionSec: number, speed: number) => Promise<void>;
  fetchLessonProgress: (lessonId: ID) => Promise<void>;
  reset: () => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  currentCourse: null,
  courseProgress: null,
  playUrl: null,
  lessonProgress: null,
  loading: false,
  error: null,

  listCourses: async (category, difficulty) => {
    set({ loading: true, error: null });
    try {
      const res = await courseApi.list(category, difficulty);
      set({ courses: res.items, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  fetchCourse: async (id) => {
    set({ loading: true, error: null });
    try {
      const course = await courseApi.get(id);
      set({ currentCourse: course, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  enroll: async (id) => {
    try {
      await courseApi.enroll(id);
      await get().fetchCourse(id);
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  fetchCourseProgress: async (id) => {
    try {
      const progress = await courseApi.getProgress(id);
      set({ courseProgress: progress });
    } catch { /* ignore */ }
  },

  fetchPlayUrl: async (lessonId) => {
    try {
      const playUrl = await courseApi.getPlayUrl(lessonId);
      set({ playUrl });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  sendHeartbeat: async (lessonId, positionSec, speed) => {
    try {
      const snapshot = await courseApi.sendHeartbeat(lessonId, { positionSec, speed });
      set({ lessonProgress: snapshot });
    } catch { /* ignore */ }
  },

  fetchLessonProgress: async (lessonId) => {
    try {
      const progress = await courseApi.getLessonProgress(lessonId);
      set({ lessonProgress: progress });
    } catch { /* ignore */ }
  },

  reset: () => set({ courses: [], currentCourse: null, courseProgress: null, playUrl: null, lessonProgress: null, loading: false, error: null }),
}));
