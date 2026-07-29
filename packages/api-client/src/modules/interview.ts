import type { ApiClient } from "../createApiClient";
import type { PageResponse } from "../types/common";

// ===== 类型定义 =====

export interface InterviewQuestion {
  id: string;
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
  createdAt: string;
}

export interface InterviewSet {
  id: string;
  title: string;
  description: string;
  questionIds: string[];
  difficulty: string;
  estimatedMinutes: number;
  status: string;
  createdAt: string;
}

export interface MockInterview {
  id: string;
  userId: string;
  interviewSetId: string;
  mode: string;
  status: string;
  overallScore: number | null;
  aiSummary: string | null;
  startedAt: string;
  completedAt: string | null;
  durationSeconds: number | null;
}

export interface MockInterviewDetail extends MockInterview {
  questions?: InterviewQuestion[];
  answers?: MockInterviewAnswer[];
}

export interface MockInterviewAnswer {
  id: string;
  mockInterviewId: string;
  questionId: string;
  questionOrder: number;
  userAnswer: string;
  aiScore: number | null;
  aiFeedback: string | null;
  aiKeyPointsHit: Record<string, boolean> | null;
  thinkingSeconds: number | null;
  answeredAt: string;
}

export interface MockInterviewStartRequest {
  mode: string;
  interviewSetId?: string;
  targetRole?: string;
  categories?: string[];
  difficulty?: string;
  questionCount?: number;
}

export interface MockInterviewAnswerRequest {
  questionId: string;
  userAnswer: string;
  thinkingSeconds?: number;
}

// ===== API 模块 =====

export function createInterviewApi(client: ApiClient) {
  return {
    // 面试题目列表
    listQuestions: (params?: {
      category?: string;
      difficulty?: string;
      company?: string;
      page?: number;
      size?: number;
    }) => client.get<PageResponse<InterviewQuestion>>("/interview/questions", { params }),

    // 面试题目详情
    getQuestion: (id: string) =>
      client.get<InterviewQuestion>(`/interview/questions/${id}`),

    // 面试套题列表
    listSets: (params?: { page?: number; size?: number }) =>
      client.get<PageResponse<InterviewSet>>("/interview/sets", { params }),

    // 面试套题详情
    getSet: (id: string) =>
      client.get<InterviewSet>(`/interview/sets/${id}`),

    // 开始模拟面试
    startMock: (data: MockInterviewStartRequest) =>
      client.post<MockInterview>("/interview/mock/start", data),

    // 获取模拟面试详情
    getMock: (id: string) =>
      client.get<MockInterviewDetail>(`/interview/mock/${id}`),

    // 面试历史
    listHistory: (params?: { page?: number; size?: number }) =>
      client.get<PageResponse<MockInterview>>("/interview/mock/history", { params }),

    // 提交答案
    submitAnswer: (id: string, data: MockInterviewAnswerRequest) =>
      client.post<MockInterviewAnswer>(`/interview/mock/${id}/answer`, data),

    // 完成面试
    completeInterview: (id: string) =>
      client.post<MockInterview>(`/interview/mock/${id}/complete`),

    // 能力画像
    getSkillProfile: () =>
      client.get<unknown[]>("/interview/skill-profile"),
  };
}
