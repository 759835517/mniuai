import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiResponse } from "@/lib/types/api";
import { tokenStorage } from "./tokenStorage";
import { isMockEnabled, getMockAdapter } from "@/lib/mocks/handler";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_PATH || "/api/backend";

export const apiClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

let refreshPromise: Promise<string | null> | null = null;

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (isMockEnabled()) {
    const mockAdapter = getMockAdapter(config);
    if (mockAdapter) {
      config.adapter = mockAdapter;
      return config;
    }
  }

  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const body = response.data as ApiResponse<unknown>;
    if (typeof body?.code === "string" && body.code !== "OK") {
      return Promise.reject(new Error(body.message || "请求失败"));
    }
    if (typeof body?.success === "boolean" && !body.success) {
      return Promise.reject(new Error(body.message || "请求失败"));
    }
    return body?.data ?? response.data;
  },
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      if (!refreshPromise) {
        refreshPromise = doRefresh().finally(() => { refreshPromise = null; });
      }
      const newToken = await refreshPromise;
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      }
    }
    return Promise.reject(new Error(extractError(error)));
  }
);

async function doRefresh(): Promise<string | null> {
  const rt = tokenStorage.getRefreshToken();
  if (!rt) return null;
  try {
    const res = await axios.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
      `${baseURL}/auth/refresh`,
      { refreshToken: rt }
    );
    const d = (res.data as unknown as ApiResponse<{ accessToken: string; refreshToken?: string }>).data ?? res.data.data;
    if (d.accessToken) {
      tokenStorage.setAccessToken(d.accessToken);
      if (d.refreshToken) tokenStorage.setRefreshToken(d.refreshToken);
      return d.accessToken;
    }
    return null;
  } catch {
    tokenStorage.clear();
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }
}

function extractError(error: AxiosError): string {
  const data = error.response?.data as { message?: string } | undefined;
  return data?.message || error.message || "网络请求失败";
}
