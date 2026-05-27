import type { ISODateTime, ID } from "./api";

export type ProjectType = "RAG" | "AGENT" | "AI_SaaS" | "MCP_SERVER";
export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";

export interface ProjectTask {
  id: ID;
  externalId: string | null;
  title: string;
  description: string | null;
  estimatedHours: number | null;
  sortOrder: number;
  completed: boolean;
  completedAt: ISODateTime | null;
}

export interface ProjectPlan {
  summary: string;
  milestones: Array<{ title: string; description: string }>;
  architectureMermaid?: string;
  codeTemplates?: Array<{ filename: string; language: string; content: string }>;
  risks?: string[];
}

export interface TechStack {
  backend?: string[];
  frontend?: string[];
  database?: string[];
  ai?: string[];
}

export interface Project {
  id: ID;
  type: ProjectType;
  projectName: string | null;
  description: string | null;
  status: ProjectStatus;
  plan: ProjectPlan;
  techStack: TechStack | null;
  tasks: ProjectTask[];
  completionRate: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
