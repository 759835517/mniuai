import { createApiClient } from "@mniuai/api-client";
import { createAuthApi } from "@mniuai/api-client";

// 程序员端专属 API（/api/v1/engineer/**）
export const engineerApi = createApiClient(
  process.env.NEXT_PUBLIC_API_URL!,
  () => typeof window !== "undefined" ? localStorage.getItem("token") : null
);

// 三端共享 API（/api/v1/common/**）
export const commonApi = createApiClient(
  process.env.NEXT_PUBLIC_COMMON_API_URL!,
  () => typeof window !== "undefined" ? localStorage.getItem("token") : null
);

export const authApi = createAuthApi(engineerApi);
