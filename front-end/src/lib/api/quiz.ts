import { apiClient } from "@/lib/utils/apiClient";
import type {
  Exam,
  ExamQuestion,
  ExamRecord,
  ExamGenerateRequest,
  ExamSubmitRequest,
  MasterySummary,
  WeekMastery,
} from "@/lib/types/quiz";
import type { PageResponse, ID } from "@/lib/types/api";

/** Backend mastery response uses snake_case keys */
interface MasteryResponse {
  overall_score: number;
  overall_level: string;
  tested_weeks: number;
  total_weeks: number;
  week_mastery: Array<{
    week: number;
    score: number | null;
    level: string;
    attempts: number;
    best_score: number | null;
    last_exam_at: string | null;
  }>;
}

function transformMastery(data: MasteryResponse): MasterySummary {
  return {
    overallScore: data.overall_score,
    overallLevel: data.overall_level as MasterySummary["overallLevel"],
    testedWeeks: data.tested_weeks,
    totalWeeks: data.total_weeks,
    weekMastery: data.week_mastery.map((w) => ({
      week: w.week,
      score: w.score,
      level: w.level as WeekMastery["level"],
      attempts: w.attempts,
      bestScore: w.best_score,
      lastExamAt: w.last_exam_at,
    })),
  };
}

export const quizApi = {
  // ========== 演示数据初始化 ==========
  initDemo(): Promise<{ roadmapId: string }> {
    return apiClient.post("/demo/init");
  },

  // ========== 测验查询 ==========
  listByRoadmap(roadmapId: ID): Promise<Exam[]> {
    return apiClient.get(`/exams/roadmap/${roadmapId}`);
  },
  getExam(examId: ID): Promise<Exam> {
    return apiClient.get(`/exams/${examId}`);
  },
  getQuestions(examId: ID): Promise<ExamQuestion[]> {
    return apiClient.get(`/exams/${examId}/questions`);
  },

  // ========== 考试流程 ==========
  startExam(examId: ID): Promise<ExamRecord> {
    return apiClient.post(`/exams/${examId}/start`);
  },
  submitExam(examId: ID, payload: ExamSubmitRequest): Promise<ExamRecord> {
    return apiClient.post(`/exams/${examId}/submit`, payload);
  },

  // ========== 考试记录 ==========
  listMyRecords(page = 0, size = 20): Promise<PageResponse<ExamRecord>> {
    return apiClient.get("/exam-records/my", { params: { page, size } });
  },
  getRecord(recordId: ID): Promise<ExamRecord> {
    return apiClient.get(`/exam-records/${recordId}`);
  },

  // ========== 掌握程度 ==========
  async getMastery(roadmapId: ID): Promise<MasterySummary> {
    const data = await apiClient.get<MasteryResponse>(`/roadmaps/${roadmapId}/mastery`);
    return transformMastery(data);
  },
};
