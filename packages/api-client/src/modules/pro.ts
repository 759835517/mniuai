import type { ApiClient } from "../createApiClient";

// ===== 类型定义 =====

export interface WritingGenerateRequest {
  docType: string;
  content: string;
  template?: string;
  industry?: string;
}

export interface WritingResultDTO {
  id: string;
  docType: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface MeetingGenerateRequest {
  topic?: string;
  participants?: string;
  record: string;
}

export interface MeetingResultDTO {
  id: string;
  topic: string;
  participants: string;
  minutes: string;
  createdAt: string;
}

export interface DataAnalysisQueryRequest {
  query: string;
  fileId?: string;
}

export interface DataAnalysisResultDTO {
  id: string;
  query: string;
  insight: string;
  chartType: string;
  createdAt: string;
}

export interface ResumeAnalyzeRequest {
  resume: string;
  targetJd?: string;
}

export interface ResumeResultDTO {
  id: string;
  atsScoreBefore: number;
  atsScoreAfter: number;
  keywords: string[];
  suggestions: ResumeSuggestionDTO[];
  createdAt: string;
}

export interface ResumeSuggestionDTO {
  type: string;
  level: string;
  before: string;
  after: string;
}

export interface ReportGenerateRequest {
  reportType: string;
  content: string;
}

export interface ReportResultDTO {
  id: string;
  reportType: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface ProAssessmentSubmitRequest {
  answers: Record<number, number>;
}

export interface ProAssessmentResultDTO {
  id: string;
  dimensionScores: Record<string, number>;
  totalScore: number;
  level: string;
  recommendation: string;
  createdAt: string;
}

export interface ProGuaranteeDTO {
  usageCount: number;
  requiredUsage: number;
  completedTasks: number;
  requiredTasks: number;
  activeDays: number;
  requiredDays: number;
  qualified: boolean;
  gaps: string[];
}

export interface FeedbackRequest {
  toolType: string;
  rating: number;
  reason?: string;
}

// ===== API 模块 =====

export function createProApi(client: ApiClient) {
  return {
    // AI 生成文档
    generateDocument: (data: WritingGenerateRequest) =>
      client.post<WritingResultDTO>("/pro/writing/generate", data),

    // AI 生成会议纪要
    generateMeetingMinutes: (data: MeetingGenerateRequest) =>
      client.post<MeetingResultDTO>("/pro/meeting/generate", data),

    // AI 数据分析
    analyzeData: (data: DataAnalysisQueryRequest) =>
      client.post<DataAnalysisResultDTO>("/pro/data-analysis/query", data),

    // AI 简历优化
    analyzeResume: (data: ResumeAnalyzeRequest) =>
      client.post<ResumeResultDTO>("/pro/resume/analyze", data),

    // AI 生成汇报材料
    generateReport: (data: ReportGenerateRequest) =>
      client.post<ReportResultDTO>("/pro/report/generate", data),

    // 能力诊断提交
    submitAssessment: (data: ProAssessmentSubmitRequest) =>
      client.post<ProAssessmentResultDTO>("/pro/assessment", data),

    // 查询对赌进度
    getGuaranteeProgress: () =>
      client.get<ProGuaranteeDTO>("/pro/guarantee/progress"),

    // 申请退款
    applyGuarantee: () =>
      client.post<string>("/pro/guarantee/apply"),

    // 获取模板列表
    listTemplates: () =>
      client.get<string[]>("/pro/templates"),

    // 工具使用评分
    submitFeedback: (data: FeedbackRequest) =>
      client.post<void>("/pro/feedback", data),
  };
}
