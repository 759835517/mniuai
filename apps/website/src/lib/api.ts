/**
 * 官网公开 API 客户端（无需登录）
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.mniuai.com";

export interface PublicCourse {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  category: string;
  difficulty: string;
  targetAudience: string;
  totalLessons: number;
  totalMinutes: number;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: { code: string; message: string } | null;
  timestamp: string;
}

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const json: ApiResponse<T> = await res.json();
  if (!json.success) {
    throw new Error(json.error?.message || "API Error");
  }
  return json.data;
}

/**
 * 获取公开课程列表
 */
export async function getPublicCourses(params?: {
  category?: string;
  difficulty?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<PublicCourse>> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.difficulty) searchParams.set("difficulty", params.difficulty);
  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.size !== undefined) searchParams.set("size", String(params.size));

  const query = searchParams.toString();
  return fetchApi<PageResponse<PublicCourse>>(`/api/v1/public/courses${query ? `?${query}` : ""}`);
}

/**
 * 获取公开课程详情
 */
export async function getPublicCourse(id: string): Promise<PublicCourse> {
  return fetchApi<PublicCourse>(`/api/v1/public/courses/${id}`);
}

/**
 * 提交联系表单
 */
export async function submitContact(data: {
  name: string;
  email: string;
  type: string;
  message: string;
}): Promise<{ id: string; status: string }> {
  return fetchApi("/api/v1/public/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
