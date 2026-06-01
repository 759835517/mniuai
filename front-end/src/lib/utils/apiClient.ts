import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiResponse } from "@/lib/types/api";
import { tokenStorage } from "./tokenStorage";
import { isMockEnabled, getMockAdapter } from "@/lib/mocks/handler";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_PATH || "/api/backend";

type DataAxiosInstance = Omit<AxiosInstance, "delete" | "get" | "patch" | "post" | "put" | "request"> & {
  request<T = unknown, R = T, D = unknown>(config: AxiosRequestConfig<D>): Promise<R>;
  get<T = unknown, R = T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  delete<T = unknown, R = T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  post<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  put<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  patch<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
};

const axiosClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: new AxiosHeaders({ "Content-Type": "application/json" }),
});

export const apiClient = axiosClient as DataAxiosInstance;

let refreshPromise: Promise<string | null> | null = null;

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (isMockEnabled()) {
    const mockAdapter = getMockAdapter(config);
    if (mockAdapter) {
      config.adapter = mockAdapter;
      return config;
    }
  }

  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return unwrapApiResponse(response) as AxiosResponse;
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
        original.headers.set("Authorization", `Bearer ${newToken}`);
        return axiosClient(original);
      }
    }
    return Promise.reject(new Error(extractError(error)));
  }
);

function unwrapApiResponse(response: AxiosResponse): unknown {
  const body = response.data as ApiResponse<unknown>;
  // Check for error in ApiResponse format: { success: false, error: { code, message } }
  if (typeof body?.success === "boolean" && !body.success) {
    const errorMessage = body.error?.message || body.message || "请求失败";
    throw new Error(errorMessage);
  }
  // Legacy format check (some APIs may return code at top level)
  if (typeof body?.code === "string" && body.code !== "OK") {
    throw new Error(body.message || "请求失败");
  }
  return body?.data ?? response.data;
}

async function doRefresh(): Promise<string | null> {
  const rt = tokenStorage.getRefreshToken();
  if (!rt) return null;
  try {
    const res = await axios.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
      `${baseURL}/auth/refresh`,
      { refreshToken: rt }
    );
    const body = res.data as unknown as ApiResponse<{ accessToken: string; refreshToken?: string }>;
    const d = body.data ?? res.data.data;
    if (d && d.accessToken) {
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
  const data = error.response?.data as { error?: { message?: string }; message?: string } | undefined;
  return data?.error?.message || data?.message || error.message || "网络请求失败";
}
