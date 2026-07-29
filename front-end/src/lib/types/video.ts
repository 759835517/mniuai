import type { ISODateTime, ID } from "./api";

export interface PlayUrlResponse {
  videoUrl: string;
  videoDuration: number;
  lastPosition: number;
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
  position: number;
  duration?: number;
  playbackRate?: number;
}

export interface Lesson {
  id: ID;
  courseId: ID;
  title: string;
  content?: string;
  videoUrl?: string;
  videoDuration?: number;
  orderNum: number;
  free: boolean;
  status: string;
  createdAt: ISODateTime;
}

export interface Course {
  id: ID;
  title: string;
  description: string;
  category: string;
  coverUrl?: string;
  difficulty: string;
  status: string;
  lessons: Lesson[];
  createdAt: ISODateTime;
}
