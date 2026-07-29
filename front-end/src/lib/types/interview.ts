import type { ISODateTime, ID } from "./api";

export interface InterviewQuestion {
  id: ID;
  category: string;
  subCategory: string;
  difficulty: string;
  title: string;
  content: string;
  keyPoints: string[];
  companies: string[];
  tags: string[];
  source: string;
  status: string;
  viewCount: number;
  createdAt: ISODateTime;
}

export interface InterviewSet {
  id: ID;
  title: string;
  description: string;
  targetRole: string;
  difficulty: string;
  questionIds: ID[];
  durationMinutes: number;
  status: string;
  createdAt: ISODateTime;
}

export interface MockInterview {
  id: ID;
  userId: ID;
  interviewSetId: ID | null;
  mode: string;
  status: string;
  overallScore: number | null;
  aiSummary: string | null;
  startedAt: ISODateTime;
  completedAt: ISODateTime | null;
  durationSeconds: number | null;
  questions?: InterviewQuestion[];
}

export interface MockInterviewAnswer {
  id: ID;
  mockInterviewId: ID;
  questionId: ID;
  questionOrder: number;
  userAnswer: string;
  aiScore: number | null;
  aiFeedback: string | null;
  aiKeyPointsHit: Record<string, boolean> | null;
  thinkingSeconds: number | null;
  answeredAt: ISODateTime;
}

export interface InterviewSkillProfile {
  id: ID;
  userId: ID;
  category: string;
  avgScore: number;
  interviewCount: number;
  lastUpdated: ISODateTime;
}

export interface MockInterviewStartRequest {
  mode: "SET" | "RANDOM" | "WEAK";
  interviewSetId?: ID;
  targetRole?: string;
  categories?: string[];
  difficulty?: string;
  questionCount?: number;
}

export interface MockInterviewAnswerRequest {
  questionId: ID;
  userAnswer: string;
  thinkingSeconds?: number;
}

export interface InterviewQuestionCreateRequest {
  category: string;
  subCategory?: string;
  difficulty: string;
  title: string;
  content: string;
  expectedAnswer?: string;
  keyPoints: string[];
  companies: string[];
  tags: string[];
  source?: string;
}
