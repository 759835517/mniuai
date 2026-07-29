import type { ApiClient } from "../createApiClient";

// ===== 类型定义 =====

export interface AssessmentSubmitRequest {
  answers: Record<number, number>;
}

export interface AssessmentResultDTO {
  id: number;
  dimensionScores: Record<string, number>;
  totalScore: number;
  level: string;
  weakPoints: string;
  recommendation: string;
  createdAt: string;
}

export interface PathDTO {
  id: string;
  name: string;
  duration: string;
  level: string;
  icon: string;
  desc: string;
  modules: string[];
  popular: boolean;
}

export interface TaskDTO {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  lang: string;
  duration: string;
  desc: string;
}

export interface TaskSubmitRequest {
  taskId: string;
  code: string;
  language?: string;
}

export interface TaskSubmitResultDTO {
  id: number;
  taskId: string;
  passed: number;
  total: number;
  score: number;
  feedback: string;
  createdAt: string;
}

export interface AlgorithmDTO {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  acceptance: string;
  description?: string;
  solved: boolean;
}

export interface AlgorithmPageDTO {
  list: AlgorithmDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AlgorithmSubmitRequest {
  problemId: string;
  code: string;
  language?: string;
}

export interface AlgorithmSubmitResultDTO {
  id: number;
  problemId: string;
  passed: boolean;
  passedCases: number;
  totalCases: number;
  feedback: string;
  createdAt: string;
}

export interface HintRequest {
  problemId: string;
  code?: string;
  currentLevel: number;
}

export interface HintResultDTO {
  level: number;
  label: string;
  content: string;
}

export interface InterviewStartRequest {
  type?: string;
  targetCompany?: string;
}

export interface InterviewStartDTO {
  sessionId: string;
  opening: string;
  firstQuestion: string;
}

export interface InterviewAnswerRequest {
  sessionId: string;
  answer: string;
}

export interface InterviewAnswerDTO {
  sessionId: string;
  reply: string;
  followUp: string;
  finished: boolean;
}

export interface InterviewReportDTO {
  sessionId: string;
  totalScore: number;
  dimensions: { name: string; score: number; weight: string }[];
  weakPoints: { topic: string; detail: string }[];
  recommendation: string;
  percentile: number;
  createdAt: string;
}

export interface CodeReviewRequest {
  code: string;
  language?: string;
}

export interface CodeReviewResultDTO {
  id: number;
  totalScore: number;
  criticalIssues: { dimension: string; level: string; before: string; after: string }[];
  improvements: { dimension: string; level: string; before: string; after: string }[];
  goodPoints: string[];
  createdAt: string;
}

export interface SystemDesignDTO {
  id: string;
  name: string;
  difficulty: string;
  tags: string[];
  description: string;
  steps: string[];
  completed: boolean;
}

export interface EngineerGuaranteeDTO {
  solvedProblems: number;
  requiredProblems: number;
  completedTasks: number;
  requiredTasks: number;
  interviewRounds: number;
  requiredInterviews: number;
  systemDesignCount: number;
  requiredSystemDesign: number;
  codeReviewCount: number;
  requiredCodeReview: number;
  jobApplications: number;
  requiredApplications: number;
  completionPct: number;
  qualified: boolean;
  gaps: string[];
}

// ===== API 模块 =====

export function createEngineerApi(client: ApiClient) {
  return {
    // 能力诊断测评
    submitAssessment: (data: AssessmentSubmitRequest) =>
      client.post<AssessmentResultDTO>("/engineer/assessment", data),

    // 学习路径列表
    listPaths: () =>
      client.get<PathDTO[]>("/engineer/paths"),

    // AI编程实战任务列表
    listTasks: () =>
      client.get<TaskDTO[]>("/engineer/tasks"),

    // 提交编程实战任务
    submitTask: (taskId: string, data: TaskSubmitRequest) =>
      client.post<TaskSubmitResultDTO>(`/engineer/tasks/${taskId}/submit`, data),

    // 算法题库列表（分页）
    listAlgorithms: (params?: { page?: number; pageSize?: number; difficulty?: string; category?: string }) => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set("page", String(params.page));
      if (params?.pageSize) qs.set("pageSize", String(params.pageSize));
      if (params?.difficulty) qs.set("difficulty", params.difficulty);
      if (params?.category) qs.set("category", params.category);
      const suffix = qs.toString() ? `?${qs.toString()}` : "";
      return client.get<AlgorithmPageDTO>(`/engineer/algorithms${suffix}`);
    },

    // 提交算法题
    submitAlgorithm: (problemId: string, data: AlgorithmSubmitRequest) =>
      client.post<AlgorithmSubmitResultDTO>(`/engineer/algorithms/${problemId}/submit`, data),

    // 请求AI提示
    getHint: (problemId: string, data: HintRequest) =>
      client.post<HintResultDTO>(`/engineer/algorithms/${problemId}/hint`, data),

    // 开始AI面试
    startInterview: (data: InterviewStartRequest) =>
      client.post<InterviewStartDTO>("/engineer/interview/start", data),

    // 提交面试回答
    answerInterview: (data: InterviewAnswerRequest) =>
      client.post<InterviewAnswerDTO>("/engineer/interview/answer", data),

    // 获取面试报告
    getInterviewReport: (sessionId: string) =>
      client.get<InterviewReportDTO>(`/engineer/interview/${sessionId}/report`),

    // 代码审查
    reviewCode: (data: CodeReviewRequest) =>
      client.post<CodeReviewResultDTO>("/engineer/code-review", data),

    // 获取系统设计题
    getSystemDesign: (topicId: string) =>
      client.get<SystemDesignDTO>(`/engineer/system-design/${topicId}`),

    // 查询对赌进度
    getGuaranteeProgress: () =>
      client.get<EngineerGuaranteeDTO>("/engineer/guarantee/progress"),

    // 申请退款
    applyGuarantee: () =>
      client.post<string>("/engineer/guarantee/apply"),
  };
}
