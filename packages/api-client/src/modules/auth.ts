import type { ApiClient } from "../createApiClient";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username?: string;
  name?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
}

export function createAuthApi(client: ApiClient) {
  return {
    login: (data: LoginRequest) =>
      client.post<AuthResponse>("/auth/login", data),
    register: (data: RegisterRequest) =>
      client.post<AuthResponse>("/auth/register", data),
    logout: () => client.post("/auth/logout"),
    refreshToken: (refreshToken: string) =>
      client.post<{ accessToken: string }>("/auth/refresh", { refreshToken }),
  };
}
