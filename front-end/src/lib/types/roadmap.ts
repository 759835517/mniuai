import type { ISODateTime, ID } from "./api";
import type { LearningGoal } from "./user";

export type RoadmapTaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface RoadmapTask {
  title: string;
  description: string;
  estimatedHours: number;
  deliverable: string;
  resources?: string[];
}

export interface RoadmapWeek {
  week: number;
  theme: string;
  objectives: string[];
  tasks: RoadmapTask[];
}

export interface RoadmapContent {
  goal: LearningGoal;
  summary: string;
  weeks: RoadmapWeek[];
}

export interface LearningRoadmap {
  id: ID;
  version: number;
  isActive: boolean;
  roadmap: RoadmapContent;
  createdAt: ISODateTime;
}

export interface RoadmapGenerateRequest {
  skills: string[];
  goal: LearningGoal;
  hours: number;
  durationWeeks?: number;
}

export interface RoadmapProgressItem {
  weekNumber: number;
  taskIndex: number;
  status: RoadmapTaskStatus;
  completedAt: ISODateTime | null;
}

export interface RoadmapProgress {
  roadmapId: ID;
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
  items: RoadmapProgressItem[];
}
