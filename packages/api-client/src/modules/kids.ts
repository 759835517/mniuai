import type { ApiClient } from "../createApiClient";

// ===== 类型定义 =====

/**
 * 少儿学习路径
 */
export interface KidsLearningPath {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  stage: string;          // SCRATCH / PYTHON / ALGORITHM / AI_CREATION / COMPETITION
  durationWeeks: number;
  levelFrom: string;
  levelTo: string;
  studentCount: number;
  sortOrder: number;
}

/**
 * 竞赛题目
 */
export interface CompetitionProblem {
  id: number;
  slug: string;
  title: string;
  difficulty: string;     // PRIMARY / JUNIOR / SENIOR
  category: string;       // CSP / NOI / BLUE_BRIDGE
  content: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  hint: string;
  timeLimitMs: number;
  memoryLimitMb: number;
}

/**
 * 竞赛代码提交结果
 */
export interface CompetitionSubmission {
  id: number;
  problemId: number;
  language: string;
  sourceCode: string;
  status: string;
  passedCount: number;
  totalCount: number;
  runtimeMs: number;
  memoryKb: number;
  submittedAt: string;
}

/**
 * 成长勋章
 */
export interface GrowthBadge {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: string;       // COURSE / PRACTICE / COMPETITION / STREAK
  requirement: number;
  earned: boolean;
}

/**
 * 少儿 AI 助教对话请求
 */
export interface KidsAiTutorRequest {
  message: string;
  sessionId?: number;
  lessonId?: number;
  code?: string;
}

/**
 * 少儿 AI 助教对话响应
 */
export interface KidsAiTutorResponse {
  sessionId: number;
  reply: string;
  suggestedAction: string;
}

/**
 * 少儿学习进度总览
 */
export interface KidsProgress {
  totalPaths: number;
  enrolledPaths: number;
  completedLessons: number;
  totalPractice: number;
  passedPractice: number;
  earnedBadges: number;
  streakDays: number;
}

/**
 * 家长监控记录
 */
export interface ParentMonitorLog {
  id: number;
  childUserId: number;
  dailyMinutes: number;
  logDate: string;
  activities: Record<string, unknown>;
}

// ===== API 模块 =====

/**
 * 少儿编程端 API 工厂函数
 * @param client API 客户端实例（已配置 baseURL 和认证拦截器）
 */
export function createKidsApi(client: ApiClient) {
  return {
    // ---------- 学习路径 ----------

    /** 查询所有已发布的少儿学习路径 */
    listLearningPaths: () =>
      client.get<KidsLearningPath[]>("/kids/paths"),

    /** 查询学习路径详情 */
    getLearningPath: (slug: string) =>
      client.get<KidsLearningPath>(`/kids/paths/${slug}`),

    // ---------- 竞赛题库 ----------

    /** 查询竞赛题目列表（支持按难度和类别筛选） */
    listCompetitionProblems: (params?: { difficulty?: string; category?: string }) =>
      client.get<CompetitionProblem[]>("/kids/competition/problems", { params }),

    /** 查询竞赛题目详情 */
    getCompetitionProblem: (problemId: number) =>
      client.get<CompetitionProblem>(`/kids/competition/problems/${problemId}`),

    /** 提交竞赛代码 */
    submitCompetitionCode: (problemId: number, language: string, sourceCode: string) =>
      client.post<CompetitionSubmission>("/kids/competition/submit", sourceCode, {
        params: { problemId, language },
      }),

    /** 查询用户竞赛提交历史 */
    getUserSubmissions: () =>
      client.get<CompetitionSubmission[]>("/kids/competition/submissions"),

    // ---------- 成长勋章 ----------

    /** 查询所有勋章及用户获得状态 */
    listBadges: () =>
      client.get<GrowthBadge[]>("/kids/badges"),

    // ---------- AI 助教 ----------

    /** AI 助教对话 */
    chatWithTutor: (data: KidsAiTutorRequest) =>
      client.post<KidsAiTutorResponse>("/kids/ai/tutor", data),

    /** 查询 AI 会话列表 */
    listTutorSessions: () =>
      client.get<Array<Record<string, unknown>>>("/kids/ai/sessions"),

    /** 查询会话对话历史 */
    getSessionMessages: (sessionId: number) =>
      client.get<Array<Record<string, unknown>>>(`/kids/ai/sessions/${sessionId}/messages`),

    // ---------- 学习进度 ----------

    /** 查询学习进度总览 */
    getUserProgress: () =>
      client.get<KidsProgress>("/kids/my/progress"),

    // ---------- 家长监控 ----------

    /** 查询少儿学习活动记录 */
    getChildActivity: (childUserId: number, days: number = 7) =>
      client.get<ParentMonitorLog[]>("/kids/parent/activity", {
        params: { childUserId, days },
      }),
  };
}
