import { createApiClient, createAuthApi, createEngineerApi, createInterviewApi } from "@mniuai/api-client";

// 程序员端 API 基础 URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// 创建 API 客户端
const engineerClient = createApiClient(
  API_URL,
  () => (typeof window !== "undefined" ? localStorage.getItem("eng_token") : null)
);

// 认证 API
export const authApi = createAuthApi(engineerClient);

// 程序员端 API
export const engineerApi = createEngineerApi(engineerClient);

// 面试 API
export const interviewApi = createInterviewApi(engineerClient);

// Token 管理
export function setTokens(accessToken: string, refreshToken: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("eng_token", accessToken);
    localStorage.setItem("eng_refresh_token", refreshToken);
  }
}

export function clearTokens() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("eng_token");
    localStorage.removeItem("eng_refresh_token");
  }
}

export function isLoggedIn() {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("eng_token");
  }
  return false;
}
