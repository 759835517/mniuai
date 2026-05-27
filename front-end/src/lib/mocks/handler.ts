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

  return undefined;
}

export function getMockAdapter(config: InternalAxiosRequestConfig) {
  const method = (config.method || "get").toLowerCase();
  const url = config.url || "";
  const data = matchRoute(url, method);
  if (data === undefined) return undefined;
  return () => ok(data, config);
}
