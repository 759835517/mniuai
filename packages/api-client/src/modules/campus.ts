import type { ApiClient } from "../createApiClient";

// ===== 类型定义 =====

export interface LearningPath {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  level: string;
  duration: string;
  salaryRange: string;
  studentCount: number;
  tags: string[];
}

export interface CourseSummary {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  duration: number;
  sortOrder: number;
}

export interface PathDetail extends LearningPath {
  courses: CourseSummary[];
  enrolled: boolean;
  progressPct: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  sortOrder: number;
  free: boolean;
  completed: boolean;
}

export interface PracticeProblem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  acceptance: number;
  sortOrder: number;
}

export interface CodeSubmitRequest {
  problemId: string;
  language: string;
  code: string;
}

export interface CodeSubmission {
  id: string;
  problemId: string;
  language: string;
  code: string;
  status: string;
  passed: boolean;
  testCaseTotal: number;
  testCasePassed: number;
  submittedAt: string;
}

export interface ProgressItem {
  pathId: string;
  pathName: string;
  courseCompletionPct: number;
  practiceCompleted: number;
  practicePassed: number;
  interviewRounds: number;
  resumeGenerated: boolean;
  enrolled: boolean;
}

export interface GuaranteeProgress {
  pathId: string;
  pathName: string;
  courseCompletionPct: number;
  practiceCompleted: number;
  practicePassed: number;
  interviewRounds: number;
  resumeGenerated: boolean;
  overallPct: number;
  allRequirementsMet: boolean;
}

export interface Enrollment {
  id: string;
  userId: string;
  pathId: string;
  enrolledAt: string;
}

export interface AiTutorRequest {
  message: string;
  lessonId?: string;
  code?: string;
  history?: AiTutorHistoryMessage[];
}

export interface AiTutorHistoryMessage {
  role: string;
  content: string;
}

export interface AiTutorResponse {
  reply: string;
  suggestedAction: string;
  relatedTopics: string[];
}

export interface PortfolioDTO {
  userId: string;
  username: string;
  school: string;
  level: string;
  pathName: string;
  bio: string;
  skills: string[];
  projects: ProjectItemDTO[];
  stats: PortfolioStatsDTO;
}

export interface ProjectItemDTO {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  demoUrl: string;
}

export interface PortfolioStatsDTO {
  practicePassed: number;
  interviewRounds: number;
  completedWeeks: number;
  streakDays: number;
}

export interface ResumeRequest {
  name: string;
  school?: string;
  major?: string;
  graduationDate?: string;
  email?: string;
  phone?: string;
  github?: string;
  bio?: string;
  skills?: string[];
  projects?: ProjectExperience[];
  experiences?: string[];
}

export interface ProjectExperience {
  name: string;
  role?: string;
  description?: string;
  techStack?: string[];
}

export interface ResumeResponse {
  markdownContent: string;
  sections: ResumeSection[];
}

export interface ResumeSection {
  title: string;
  content: string;
}

export interface SubscriptionPlanDTO {
  id: string;
  name: string;
  price: string;
  period: string;
  highlight: boolean;
  tag: string | null;
  features: string[];
}

export interface GuaranteeApplicationRequest {
  pathSlug: string;
  agreementVersion?: string;
}

export interface GuaranteeApplicationDTO {
  id: string;
  userId: string;
  pathSlug: string;
  pathName: string;
  status: string;
  agreementVersion: string;
  appliedAt: string;
  expiresAt: string;
}

export interface EmploymentReportRequest {
  companyName: string;
  position?: string;
  salary?: string;
  offerDate?: string;
  offerImageUrl?: string;
  jobType?: string;
}

export interface EmploymentReportDTO {
  id: string;
  userId: string;
  companyName: string;
  position: string | null;
  salary: string | null;
  offerDate: string | null;
  offerImageUrl: string | null;
  jobType: string | null;
  status: string;
  reportedAt: string;
}

// ===== API 模块 =====

export function createCampusApi(client: ApiClient) {
  return {
    // 学习路径列表
    listPaths: () => client.get<LearningPath[]>("/campus/paths"),

    // 学习路径详情
    getPathDetail: (slug: string) =>
      client.get<PathDetail>(`/campus/paths/${slug}`),

    // 报名学习路径
    enrollPath: (slug: string) =>
      client.post<Enrollment>(`/campus/paths/${slug}/enroll`),

    // 课程课时列表
    listLessons: (courseId: string) =>
      client.get<Lesson[]>(`/campus/courses/${courseId}/lessons`),

    // 编程练习题目列表
    listProblems: (params?: { difficulty?: string; category?: string }) =>
      client.get<PracticeProblem[]>("/campus/practice/problems", { params }),

    // 提交代码
    submitCode: (data: CodeSubmitRequest) =>
      client.post<CodeSubmission>("/campus/practice/submit", data),

    // 学习进度总览
    getUserProgress: () =>
      client.get<ProgressItem[]>("/campus/my/progress"),

    // 对赌进度详情
    getGuaranteeProgress: (slug: string) =>
      client.get<GuaranteeProgress>("/campus/guarantee/progress", { params: { slug } }),

    // AI 助教对话
    chatWithTutor: (data: AiTutorRequest) =>
      client.post<AiTutorResponse>("/campus/ai/tutor", data),

    // 获取作品集
    getPortfolio: () =>
      client.get<PortfolioDTO>("/campus/portfolio"),

    // AI 生成简历
    generateResume: (data: ResumeRequest) =>
      client.post<ResumeResponse>("/campus/resume/generate", data),

    // 订阅计划列表
    listSubscriptionPlans: () =>
      client.get<SubscriptionPlanDTO[]>("/campus/subscription/plans"),

    // 申请对赌协议
    applyForGuarantee: (data: GuaranteeApplicationRequest) =>
      client.post<GuaranteeApplicationDTO>("/campus/guarantee/apply", data),

    // 就业上报
    reportEmployment: (data: EmploymentReportRequest) =>
      client.post<EmploymentReportDTO>("/campus/employment/report", data),
  };
}
