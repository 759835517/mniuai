import { createApiClient, createAuthApi, createKidsApi } from "@mniuai/api-client";

/**
 * 少儿端专属 API 客户端
 * 路由前缀：/api/v1/kids/**
 */
export const kidsApiClient = createApiClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1/kids",
  () => typeof window !== "undefined" ? localStorage.getItem("token") : null
);

/**
 * 三端共享 API 客户端
 * 路由前缀：/api/v1/common/**
 */
export const commonApi = createApiClient(
  process.env.NEXT_PUBLIC_COMMON_API_URL || "http://localhost:8080/api/v1/common",
  () => typeof window !== "undefined" ? localStorage.getItem("token") : null
);

/**
 * 认证 API（登录/注册/登出）
 */
export const authApi = createAuthApi(kidsApiClient);

/**
 * 少儿端业务 API（学习路径、竞赛、勋章、AI 助教等）
 */
export const kidsApi = createKidsApi(kidsApiClient);
