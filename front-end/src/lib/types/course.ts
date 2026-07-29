import type { ISODateTime, ID } from "./api";

export interface CourseSummary {
  id: ID;
  title: string;
  coverUrl: string | null;
  category: string;
  difficulty: string;
  totalLessons: number;
  totalMinutes: number;
  enrolled: boolean;
  progressPercent: number;
}

export interface LessonSummary {
  id: ID;
  title: string;
  thumbnailUrl: string | null;
  durationSec: number;
  sortOrder: number;
  free: boolean;
  unlocked: boolean;
  completed: boolean;
}

export interface CourseDetail {
  id: ID;
  title: string;
  description: string;
  coverUrl: string | null;
  category: string;
  difficulty: string;
  targetAudience: string;
  totalLessons: number;
  totalMinutes: number;
  enrolled: boolean;
  lessons: LessonSummary[];
}

export interface LessonProgress {
  lessonId: ID;
  title: string;
  lastPositionSec: number;
  validWatchedSec: number;
  completed: boolean;
}

export interface CourseProgress {
  courseId: ID;
  totalLessons: number;
  completedLessons: number;
  completionPercent: number;
  lessons: LessonProgress[];
}

export interface PlayUrlResponse {
  videoUrl: string;
  durationSec: number;
  lastPositionSec: number;
  completed: boolean;
}

export interface ProgressSnapshot {
  lastPositionSec: number;
  validWatchedSec: number;
  totalDurationSec: number;
  watchRatio: number;
  completed: boolean;
}

export interface HeartbeatRequest {
  positionSec: number;
  speed: number;
}

export interface CourseCreateRequest {
  title: string;
  description: string;
  coverUrl: string;
  category: string;
  difficulty: string;
  targetAudience: string;
  totalLessons: number;
  totalMinutes: number;
  sortOrder: number;
}

export interface LessonCreateRequest {
  title: string;
  description: string;
  videoUrl: string;
  videoDuration: number;
  thumbnailUrl: string;
  sortOrder: number;
  free: boolean;
  requiresExamPass: boolean;
}
