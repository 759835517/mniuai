// 三端共享的 API 模块，每端通过不同的 baseURL 实例调用

export { createApiClient } from "./createApiClient";

// 共享类型
export type * from "./types/common";

// 共享 API 模块（三端均可使用）
export * from "./modules/auth";
export * from "./modules/campus";
export * from "./modules/interview";
export * from "./modules/edu";
export * from "./modules/pro";
export * from "./modules/engineer";
export * from "./modules/kids";
