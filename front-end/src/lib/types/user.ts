import type { ISODateTime, ID } from "./api";

export type UserStatus = "ACTIVE" | "BANNED";
export type UserRole = "USER" | "ADMIN";
export type LearningGoal = "Agent" | "RAG" | "AI_SaaS" | "MCP_SERVER";

export interface User {
  id: ID;
  email: string;
  nickname: string | null;
  avatarUrl: string | null;
  currentSkills: string[];
  learningGoal: LearningGoal | null;
  availableHours: number;
  roles: UserRole[];
  status: UserStatus;
  createdAt: ISODateTime;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface TokenResponse {
  userId?: ID;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType?: "Bearer";
}

export interface UpdateUserRequest {
  nickname?: string;
  avatarUrl?: string;
}

export interface UpdateSkillsRequest {
  currentSkills: string[];
  learningGoal: LearningGoal;
  availableHours: number;
}
