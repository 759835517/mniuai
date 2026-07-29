import { apiClient } from "@/lib/utils/apiClient";
import type {
  Exam,
  ExamQuestion,
  ExamRecord,
  ExamGenerateRequest,
  ExamSubmitRequest,
  MasterySummary,
} from "@/lib/types/quiz";
import type { PageResponse, ID } from "@/lib/types/api";

export const quizApi = {
  // ========== 管理端 ==========
  generateExams(payload: ExamGenerateRequest): Promise<Exam[]> {
    return apiClient.post("/admin/exams/generate", payload);
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
  getMastery(roadmapId: ID): Promise<MasterySummary> {
    return apiClient.get(`/roadmaps/${roadmapId}/mastery`);
  },
};
