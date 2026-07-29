import type { ApiClient } from "../createApiClient";

// ===== 类型定义 =====

export interface LessonGenerateRequest {
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  objective?: string;
  textbook: string;
}

export interface LessonDTO {
  id: string;
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  content: string;
  createdAt: string;
}

export interface QuizGenerateRequest {
  subject: string;
  grade: string;
 知识点?: string;
  questionTypes: string[];
  difficulty: string;
  count: number;
  withAnswer: boolean;
}

export interface QuizQuestionDTO {
  id: string;
  type: string;
  content: string;
  options?: string[];
  answer: string;
  analysis?: string;
  difficulty: string;
 知识点?: string;
}

export interface QuizExportRequest {
  questions: QuizQuestionDTO[];
  title: string;
  totalScore: number;
}

export interface GradeUploadRequest {
  file: File;
  subject: string;
  grade: string;
  questionType: string;
}

export interface GradeResultDTO {
  id: string;
  subject: string;
  totalScore: number;
  items: GradeItemDTO[];
  createdAt: string;
}

export interface GradeItemDTO {
  questionNumber: number;
  score: number;
  maxScore: number;
  comment: string;
  confidence: number;
}

export interface SlidesGenerateRequest {
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  style: string;
}

export interface SlidesDTO {
  id: string;
  subject: string;
  grade: string;
  topic: string;
  slides: SlideItemDTO[];
  createdAt: string;
}

export interface SlideItemDTO {
  pageNumber: number;
  title: string;
  content: string;
  notes?: string;
}

export interface UsageRecordDTO {
  id: string;
  toolType: string;
  action: string;
  duration: number;
  createdAt: string;
}

export interface UsageStatsDTO {
  totalUsage: number;
  lessonCount: number;
  quizCount: number;
  gradeCount: number;
  slidesCount: number;
  streakDays: number;
  guaranteeProgress: number;
}

export interface TemplateDTO {
  id: string;
  title: string;
  category: string;
  subject: string;
  grade: string;
  content: string;
  usageCount: number;
  isOfficial: boolean;
}

export interface GuaranteeCheckDTO {
  totalUsage: number;
  requiredUsage: number;
  daysUsed: number;
  requiredDays: number;
  toolsUsed: number;
  requiredTools: number;
  qualified: boolean;
  gaps: string[];
}

// ===== API 模块 =====

export function createEduApi(client: ApiClient) {
  return {
    // AI 生成教案
    generateLesson: (data: LessonGenerateRequest) =>
      client.post<string>("/edu/lesson/generate", data),

    // 保存教案
    saveLesson: (data: LessonDTO) =>
      client.post<LessonDTO>("/edu/lesson/save", data),

    // 获取教案列表
    listLessons: (params?: { subject?: string; grade?: string; page?: number; size?: number }) =>
      client.get<LessonDTO[]>("/edu/lesson/list", { params }),

    // 获取教案详情
    getLesson: (id: string) =>
      client.get<LessonDTO>(`/edu/lesson/${id}`),

    // 删除教案
    deleteLesson: (id: string) =>
      client.delete<void>(`/edu/lesson/${id}`),

    // AI 生成题目
    generateQuiz: (data: QuizGenerateRequest) =>
      client.post<QuizQuestionDTO[]>("/edu/quiz/generate", data),

    // 保存题目到题库
    saveQuizQuestion: (data: QuizQuestionDTO) =>
      client.post<QuizQuestionDTO>("/edu/quiz/save", data),

    // 获取题库列表
    listQuizBank: (params?: { subject?: string; grade?: string; difficulty?: string }) =>
      client.get<QuizQuestionDTO[]>("/edu/quiz/list", { params }),

    // 导出试卷
    exportQuiz: (data: QuizExportRequest) =>
      client.post<Blob>("/edu/quiz/export", data, { responseType: "blob" }),

    // AI 批改（简化版）
    gradeSubmission: (data: { subject: string; question: string; studentAnswer: string; standardAnswer?: string }) =>
      client.post<GradeResultDTO>("/edu/grade/submit", data),

    // 获取批改历史
    listGradeHistory: () =>
      client.get<GradeResultDTO[]>("/edu/grade/history"),

    // AI 生成课件
    generateSlides: (data: SlidesGenerateRequest) =>
      client.post<SlidesDTO>("/edu/slides/generate", data),

    // 获取课件列表
    listSlides: () =>
      client.get<SlidesDTO[]>("/edu/slides/list"),

    // 记录使用行为
    recordUsage: (data: { toolType: string; action: string; duration?: number }) =>
      client.post<void>("/edu/usage/record", data),

    // 获取使用统计
    getUsageStats: () =>
      client.get<UsageStatsDTO>("/edu/usage/stats"),

    // 获取模板列表
    listTemplates: (params?: { category?: string; subject?: string }) =>
      client.get<TemplateDTO[]>("/edu/templates/list", { params }),

    // 获取模板详情
    getTemplate: (id: string) =>
      client.get<TemplateDTO>(`/edu/templates/${id}`),

    // 检查对赌达成情况
    checkGuarantee: () =>
      client.get<GuaranteeCheckDTO>("/edu/guarantee/check"),

    // 申请退款
    applyRefund: (data: { reason: string }) =>
      client.post<void>("/edu/guarantee/apply", data),
  };
}
