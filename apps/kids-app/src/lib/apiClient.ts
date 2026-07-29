import { createApiClient } from "@mniuai/api-client";
import { createAuthApi } from "@mniuai/api-client";

// 少儿端专属 API（/api/v1/kids/**）
export const kidsApi = createApiClient(
  process.env.NEXT_PUBLIC_API_URL!,
  () => typeof window !== "undefined" ? localStorage.getItem("token") : null
);

// 三端共享 API（/api/v1/common/**）
export const commonApi = createApiClient(
  process.env.NEXT_PUBLIC_COMMON_API_URL!,
  () => typeof window !== "undefined" ? localStorage.getItem("token") : null
);

export const authApi = createAuthApi(kidsApi);
