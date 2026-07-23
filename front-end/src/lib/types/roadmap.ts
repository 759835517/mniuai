import type { ISODateTime, ID } from "./api";
import type { LearningGoal } from "./user";

export type RoadmapTaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface RoadmapTask {
  id?: ID;
  title: string;
  description: string;
  estimatedHours: number;
  deliverable: string;
  resources?: string[];
  completed?: boolean;
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

/** Raw task from backend (flat structure) */
export interface RoadmapTaskRaw {
  id: string;
  week: number;
  title: string;
  completed: boolean;
}

/** Raw roadmap from backend */
export interface LearningRoadmapRaw {
  id: string;
  userId?: string;
  targetRole?: string;
  weeklyHours?: number;
  active?: boolean;
  tasks: RoadmapTaskRaw[];
  createdAt?: ISODateTime;
}

/** Frontend roadmap (wrapped with roadmap.content) */
export interface LearningRoadmap {
  id: ID;
  version?: number;
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
  /** Backend returns completionPercent (0-100), frontend normalizes to completionRate (0-1) */
  completionRate: number;
  items: RoadmapProgressItem[];
  /** Raw field from backend */
  completionPercent?: number;
}

export function progressFromRoadmap(roadmap: LearningRoadmapRaw | LearningRoadmap): RoadmapProgress {
  const raw = "roadmap" in roadmap ? null : roadmap;
  const frontend = transformRoadmap(roadmap);
  const items: RoadmapProgressItem[] = [];
  let totalTasks = 0;
  let completedTasks = 0;

  frontend.roadmap.weeks.forEach((week) => {
    week.tasks.forEach((task, taskIndex) => {
      totalTasks += 1;
      if (task.completed) {
        completedTasks += 1;
      }
      items.push({
        weekNumber: week.week,
        taskIndex,
        status: task.completed ? "COMPLETED" : "NOT_STARTED",
        completedAt: task.completed ? new Date().toISOString() : null,
      });
    });
  });

  if (raw && items.length === 0) {
    raw.tasks?.forEach((task, index) => {
      const completed = task.completed;
      totalTasks += 1;
      if (completed) {
        completedTasks += 1;
      }
      items.push({
        weekNumber: task.week,
        taskIndex: index,
        status: completed ? "COMPLETED" : "NOT_STARTED",
        completedAt: completed ? new Date().toISOString() : null,
      });
    });
  }

  return {
    roadmapId: frontend.id,
    totalTasks,
    completedTasks,
    completionRate: totalTasks > 0 ? completedTasks / totalTasks : 0,
    items,
  };
}

/**
 * Transform backend flat roadmap to frontend LearningRoadmap.
 * Backend returns: { id, targetRole, weeklyHours, active, tasks: [{week, title, completed}], ... }
 * Frontend expects: { id, isActive, roadmap: { goal, summary, weeks: [{week, theme, objectives, tasks: [{title}]}] } }
 */
export function transformRoadmap(raw: LearningRoadmapRaw | LearningRoadmap): LearningRoadmap {
  // Already in frontend format
  if (raw && "roadmap" in raw && (raw as LearningRoadmap).roadmap?.weeks) {
    return raw as LearningRoadmap;
  }

  const r = raw as LearningRoadmapRaw;
  const tasks = r.tasks || [];

  // Group tasks by week
  const weekMap = new Map<number, RoadmapTaskRaw[]>();
  for (const t of tasks) {
    const existing = weekMap.get(t.week) || [];
    existing.push(t);
    weekMap.set(t.week, existing);
  }

  // Chinese theme names for weeks
  const weekThemeMap: Record<number, string> = {
    1: "基础入门",
    2: "核心技术学习",
    3: "框架深入",
    4: "实战练习",
    5: "项目搭建",
    6: "功能开发",
    7: "测试与优化",
    8: "部署上线",
  };

  // Sort weeks and build RoadmapWeek[]
  const weeks: RoadmapWeek[] = Array.from(weekMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([weekNum, weekTasks]) => ({
      week: weekNum,
      theme: weekThemeMap[weekNum] || `第 ${weekNum} 周`,
      objectives: weekTasks.map((t) => t.title),
      tasks: weekTasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: "",
        estimatedHours: 0,
        deliverable: "",
        completed: t.completed,
      })),
    }));

  const goalMap: Record<string, LearningGoal> = {
    RAG: "RAG",
    Agent: "Agent",
    AI_SaaS: "AI_SaaS",
    MCP_SERVER: "MCP_SERVER",
  };

  const goalLabelMap: Record<string, string> = {
    RAG: "RAG 应用",
    Agent: "Agent 应用",
    AI_SaaS: "AI SaaS",
    MCP_SERVER: "MCP Server",
  };

  return {
    id: r.id,
    isActive: r.active ?? false,
    roadmap: {
      goal: goalMap[r.targetRole || ""] || "RAG",
      summary: `每周 ${r.weeklyHours || 10} 小时学习计划 — ${goalLabelMap[r.targetRole || ""] || r.targetRole || "AI 工程师"}`,
      weeks,
    },
    createdAt: r.createdAt || new Date().toISOString(),
  };
}
