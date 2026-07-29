import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

// API 客户端返回类型：拦截器已解包 response.data.data
export interface ApiClient {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export function createApiClient(baseURL: string, getToken: () => string | null): ApiClient {
  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (res) => res.data?.data ?? res.data,
    (err) => {
      const status = err.response?.status;
      if (status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
      return Promise.reject(err.response?.data ?? err);
    }
  );

  return client as unknown as ApiClient;
}

export type { AxiosInstance, AxiosRequestConfig };
