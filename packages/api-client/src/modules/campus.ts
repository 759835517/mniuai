import type { AxiosInstance } from "../createApiClient";

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

// ===== API 模块 =====

export function createCampusApi(client: AxiosInstance) {
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
  };
}
