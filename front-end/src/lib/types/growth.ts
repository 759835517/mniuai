import type { ISODate, ISODateTime, ID } from "./api";

export interface GrowthProfile {
  userId: ID;
  xp: number;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: ISODate | null;
  totalProjects: number;
  totalReviews: number;
}

export interface Achievement {
  id: ID;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt: ISODateTime | null;
}

export interface ActivityLog {
  id: ID;
  activityType: string;
  xpEarned: number;
  referenceId: ID | null;
  referenceType: "ROADMAP" | "PROJECT" | "REVIEW" | "COACH" | null;
  metadata: Record<string, unknown> | null;
  createdAt: ISODateTime;
}

export interface GrowthStats {
  dailyXp: Array<{ date: ISODate; xp: number }>;
  activityDistribution: Array<{ type: string; count: number }>;
  projectCompletion: { active: number; completed: number; archived: number };
}

export interface NotificationItem {
  id: ID;
  type: "ACHIEVEMENT" | "REMINDER" | "STREAK" | "MILESTONE";
  title: string;
  content: string | null;
  isRead: boolean;
  createdAt: ISODateTime;
}

export interface LandingStats {
  totalLearners: number;
  totalProjects: number;
  totalCoachMessages: number;
}
