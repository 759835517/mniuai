import type { ISODateTime, ID } from "./api";

export interface Exam {
  id: ID;
  roadmapId: ID;
  week: number;
  title: string;
  description: string;
  questionCount: number;
  timeLimitMinutes: number;
  passingScore: number;
  createdAt: ISODateTime;
}

export interface QuestionOption {
  key: string;
  content: string;
}

export interface ExamQuestion {
  id: ID;
  examId: ID;
  questionType: "SINGLE_CHOICE" | "MULTI_CHOICE" | "THINKING";
  orderNum: number;
  content: string;
  options: QuestionOption[] | null;
  explanation: string;
  xpReward: number;
}

export interface AnswerDetail {
  questionId: ID;
  questionType: string;
  userAnswer: unknown;
  isCorrect: boolean | null;
  pointsEarned: number;
}

export interface ThinkingEvaluation {
  questionId: ID;
  score: number;
  maxScore: number;
  feedback: string;
  dimensionScores: Record<string, number>;
}

export interface AiEvaluation {
  thinkingQuestions: ThinkingEvaluation[];
  overallComment: string;
}

export interface ExamRecord {
  id: ID;
  userId: ID;
  examId: ID;
  score: number;
  passed: boolean;
  totalQuestions: number;
  correctCount: number;
  answers: AnswerDetail[];
  aiEvaluation: AiEvaluation | null;
  startedAt: ISODateTime;
  completedAt: ISODateTime | null;
}

export interface ExamGenerateRequest {
  roadmapId: ID;
}

export interface AnswerItem {
  questionId: ID;
  userAnswer: unknown;
}

export interface ExamSubmitRequest {
  recordId: ID;
  answers: AnswerItem[];
}

export interface WeekMastery {
  week: number;
  score: number | null;
  level: "MASTERY" | "GOOD" | "PASS" | "FAIL" | "NOT_TESTED";
  attempts: number;
  bestScore: number | null;
  lastExamAt: ISODateTime | null;
}

export interface MasterySummary {
  overallScore: number;
  overallLevel: "MASTERY" | "GOOD" | "PASS" | "FAIL";
  testedWeeks: number;
  totalWeeks: number;
  weekMastery: WeekMastery[];
}
