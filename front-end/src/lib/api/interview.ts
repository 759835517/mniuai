import { apiClient } from "@/lib/utils/apiClient";
import type {
  InterviewQuestion,
  InterviewSet,
  MockInterview,
  MockInterviewAnswer,
  MockInterviewStartRequest,
  MockInterviewAnswerRequest,
  InterviewSkillProfile,
  InterviewQuestionCreateRequest,
} from "@/lib/types/interview";
import type { PageResponse, ID } from "@/lib/types/api";

export const interviewApi = {
  // ========== 题库 ==========
  listQuestions(params?: { category?: string; difficulty?: string; company?: string; page?: number; size?: number }): Promise<PageResponse<InterviewQuestion>> {
    return apiClient.get("/interview/questions", { params });
  },
  getQuestion(id: ID): Promise<InterviewQuestion> {
    return apiClient.get(`/interview/questions/${id}`);
  },

  // ========== 套题 ==========
  listSets(page = 0, size = 20): Promise<PageResponse<InterviewSet>> {
    return apiClient.get("/interview/sets", { params: { page, size } });
  },
  getSet(id: ID): Promise<InterviewSet> {
    return apiClient.get(`/interview/sets/${id}`);
  },

  // ========== 模拟面试 ==========
  startMock(payload: MockInterviewStartRequest): Promise<MockInterview> {
    return apiClient.post("/interview/mock/start", payload);
  },
  getMock(id: ID): Promise<MockInterview> {
    return apiClient.get(`/interview/mock/${id}`);
  },
  listHistory(page = 0, size = 20): Promise<PageResponse<MockInterview>> {
    return apiClient.get("/interview/mock/history", { params: { page, size } });
  },
  submitAnswer(id: ID, payload: MockInterviewAnswerRequest): Promise<MockInterviewAnswer> {
    return apiClient.post(`/interview/mock/${id}/answer`, payload);
  },
  complete(id: ID): Promise<MockInterview> {
    return apiClient.post(`/interview/mock/${id}/complete`);
  },

  // ========== 能力画像 ==========
  getSkillProfile(): Promise<InterviewSkillProfile[]> {
    return apiClient.get("/interview/skill-profile");
  },

  // ========== 管理端 ==========
  createQuestion(payload: InterviewQuestionCreateRequest): Promise<InterviewQuestion> {
    return apiClient.post("/interview/admin/questions", payload);
  },
  batchCreateQuestions(payload: InterviewQuestionCreateRequest[]): Promise<InterviewQuestion[]> {
    return apiClient.post("/interview/admin/questions/batch", payload);
  },
};
