import type { InternalAxiosRequestConfig } from "axios";
import {
  mockUser,
  mockTokenResponse,
  mockRoadmap,
  mockProgress,
  mockSessions,
  mockMessages,
  mockProjects,
  mockReview,
  mockGrowth,
  mockAchievements,
  mockStats,
  mockNotifications,
  mockLandingStats,
  mockCourses,
  mockCourseDetail,
  mockPlayUrl,
  mockLessonProgress,
  mockArticles,
  mockArticleDetail,
  mockQuestions,
  mockSets,
  mockInterview,
  mockSkillProfile,
  mockExams,
  mockExamQuestions,
  mockExamRecord,
  mockMastery,
} from "./data";
import type { PageResponse } from "@/lib/types/api";

export function isMockEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_MOCK === "true";
}

function pageResponse<T>(items: T[]): PageResponse<T> {
  return { items, page: 0, size: 20, totalElements: items.length, totalPages: 1, hasNext: false };
}

function ok<T>(data: T, config: InternalAxiosRequestConfig) {
  return Promise.resolve({ data: { success: true, code: "OK", message: "ok", data }, status: 200, statusText: "OK", headers: {}, config });
}

function matchRoute(url: string, method: string): unknown {
  const u = url.replace(/^\/api\/backend/, "").replace(/\?.*$/, "");

  // Auth
  if (method === "post" && u === "/auth/login") return mockTokenResponse;
  if (method === "post" && u === "/auth/register") return mockTokenResponse;

  // Users
  if (method === "get" && u === "/users/me") return mockUser;

  // Roadmap
  if (method === "get" && u === "/roadmaps/active") return mockRoadmap;
  if (method === "post" && u === "/roadmaps/generate") return mockRoadmap;
  if (method === "get" && /^\/roadmaps\/[^/]+\/progress$/.test(u)) return mockProgress;
  if ((method === "put" || method === "patch") && /^\/roadmaps\/[^/]+/.test(u)) return { success: true };

  // Coach
  if (method === "get" && u === "/coach/sessions") return pageResponse(mockSessions);
  if (method === "post" && u === "/coach/sessions") return mockSessions[0];
  if (method === "delete" && /^\/coach\/sessions\/[^/]+$/.test(u)) return { deleted: true };
  if (method === "get" && /^\/coach\/sessions\/[^/]+\/messages$/.test(u)) return pageResponse(mockMessages);

  // Projects
  if (method === "get" && u === "/projects") return pageResponse(mockProjects);
  if (method === "post" && u === "/projects") return mockProjects[0];
  if (method === "get" && /^\/projects\/[^/]+$/.test(u)) return mockProjects[0];
  if ((method === "patch" || method === "delete") && /^\/projects\/[^/]+/.test(u)) return mockProjects[0];

  // Reviews
  if (method === "post" && u === "/reviews") return mockReview;
  if (method === "get" && /^\/reviews\/[^/]+$/.test(u)) return mockReview;
  if (method === "get" && u === "/reviews") return pageResponse([mockReview]);

  // Growth
  if (method === "get" && u === "/growth/profile") return mockGrowth;
  if (method === "get" && u === "/growth/achievements") return mockAchievements;
  if (method === "get" && u === "/growth/stats") return mockStats;

  // Notifications
  if (method === "get" && u === "/notifications") return pageResponse(mockNotifications);

  // Landing
  if (method === "get" && u === "/landing/stats") return mockLandingStats;

  // Courses
  if (method === "get" && u === "/courses") return pageResponse(mockCourses);
  if (method === "get" && /^\/courses\/[^/]+$/.test(u)) return mockCourseDetail;
  if (method === "post" && /^\/courses\/[^/]+\/enroll$/.test(u)) return { success: true };
  if (method === "get" && /^\/courses\/[^/]+\/progress$/.test(u)) return { courseId: mockCourseDetail.id, totalLessons: 3, completedLessons: 1, completionPercent: 33, lessons: [] };

  // Video
  if (method === "get" && /^\/lessons\/[^/]+\/play-url$/.test(u)) return mockPlayUrl;
  if (method === "post" && /^\/lessons\/[^/]+\/heartbeat$/.test(u)) return mockLessonProgress;
  if (method === "get" && /^\/lessons\/[^/]+\/progress$/.test(u)) return mockLessonProgress;

  // Admin Courses
  if (method === "get" && u === "/admin/courses") return pageResponse(mockCourses);
  if (method === "post" && u === "/admin/courses") return mockCourses[0];
  if ((method === "put" || method === "delete") && /^\/admin\/courses/.test(u)) return { success: true };

  // Articles (Frontend)
  if (method === "get" && u === "/articles") return pageResponse(mockArticles.filter(a => a.status === "PUBLISHED"));
  if (method === "get" && /^\/articles\/[^/]+$/.test(u)) return mockArticleDetail;
  if (method === "post" && /^\/articles\/[^/]+\/read-progress$/.test(u)) return { success: true };
  if (method === "post" && /^\/articles\/[^/]+\/like$/.test(u)) return { success: true };

  // Articles (Admin)
  if (method === "get" && u === "/admin/articles") return pageResponse(mockArticles);
  if (method === "get" && /^\/admin\/articles\/[^/]+$/.test(u)) return mockArticles[0];
  if (method === "post" && u === "/admin/articles") return mockArticles[0];
  if (method === "put" && /^\/admin\/articles\/[^/]+$/.test(u)) return mockArticles[0];
  if (method === "post" && /^\/admin\/articles\/[^/]+\/publish$/.test(u)) return { ...mockArticles[0], status: "PUBLISHED" };
  if (method === "post" && /^\/admin\/articles\/[^/]+\/archive$/.test(u)) return { ...mockArticles[0], status: "ARCHIVED" };
  if (method === "delete" && /^\/admin\/articles\/[^/]+$/.test(u)) return { success: true };

  // Interview (Frontend)
  if (method === "get" && u === "/interview/questions") return pageResponse(mockQuestions);
  if (method === "get" && /^\/interview\/questions\/[^/]+$/.test(u)) return mockQuestions[0];
  if (method === "get" && u === "/interview/sets") return pageResponse(mockSets);
  if (method === "get" && /^\/interview\/sets\/[^/]+$/.test(u)) return mockSets[0];
  if (method === "post" && u === "/interview/mock/start") return mockInterview;
  if (method === "get" && /^\/interview\/mock\/[^/]+$/.test(u)) return mockInterview;
  if (method === "get" && u === "/interview/mock/history") return pageResponse([mockInterview]);
  if (method === "post" && /^\/interview\/mock\/[^/]+\/answer$/.test(u)) return { id: crypto.randomUUID(), aiScore: 8, aiFeedback: "回答正确，思路清晰", aiKeyPointsHit: { "时间复杂度": true } };
  if (method === "post" && /^\/interview\/mock\/[^/]+\/complete$/.test(u)) return mockInterview;
  if (method === "get" && u === "/interview/skill-profile") return mockSkillProfile;

  // Interview (Admin)
  if (method === "post" && u === "/interview/admin/questions") return mockQuestions[0];
  if (method === "post" && u === "/interview/admin/questions/batch") return mockQuestions;

  // Quiz - Exams
  if (method === "get" && /^\/exams\/roadmap\/[^/]+$/.test(u)) return mockExams;
  if (method === "get" && /^\/exams\/[^/]+$/.test(u)) return mockExams[0];
  if (method === "get" && /^\/exams\/[^/]+\/questions$/.test(u)) return mockExamQuestions;
  if (method === "post" && /^\/exams\/[^/]+\/start$/.test(u)) return mockExamRecord;
  if (method === "post" && /^\/exams\/[^/]+\/submit$/.test(u)) return { ...mockExamRecord, score: 80, passed: true };
  if (method === "get" && u === "/exam-records/my") return pageResponse([mockExamRecord]);
  if (method === "get" && /^\/exam-records\/[^/]+$/.test(u)) return mockExamRecord;
  if (method === "get" && /^\/roadmaps\/[^/]+\/mastery$/.test(u)) return mockMastery;

  // Quiz - Admin
  if (method === "post" && u === "/admin/exams/generate") return mockExams;

  return undefined;
}

export function getMockAdapter(config: InternalAxiosRequestConfig) {
  const method = (config.method || "get").toLowerCase();
  const url = config.url || "";
  const data = matchRoute(url, method);
  if (data === undefined) return undefined;
  return () => ok(data, config);
}
