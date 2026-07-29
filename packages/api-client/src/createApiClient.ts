import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

export function createApiClient(baseURL: string, getToken: () => string | null): AxiosInstance {
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

  return client;
}

export type { AxiosInstance, AxiosRequestConfig };
