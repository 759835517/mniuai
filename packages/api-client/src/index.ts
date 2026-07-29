// 三端共享的 API 模块，每端通过不同的 baseURL 实例调用

export { createApiClient } from "./createApiClient";

// 共享类型
export type * from "./types/common";

// 共享 API 模块（三端均可使用）
export * from "./modules/auth";
export * from "./modules/user";
export * from "./modules/video";
export * from "./modules/article";
export * from "./modules/exam";
export * from "./modules/growth";
export * from "./modules/notification";
