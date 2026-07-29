import { createApiClient, createAuthApi, createCampusApi } from "@mniuai/api-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

// Token 存储键名
const TOKEN_KEY = "campus_token";
const REFRESH_TOKEN_KEY = "campus_refresh_token";

// 获取 token（客户端）
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

// 获取 refresh token
function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// 保存 token
export function setTokens(token: string, refreshToken: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

// 清除 token
export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// 检查是否已登录
export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(TOKEN_KEY);
}

// 创建 API 客户端（响应拦截器已内置提取 data.data）
const client = createApiClient(API_BASE_URL, getToken);

// 导出 API 模块
export const authApi = createAuthApi(client);
export const campusApi = createCampusApi(client);

export { client };
