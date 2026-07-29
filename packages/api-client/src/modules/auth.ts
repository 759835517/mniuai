import type { AxiosInstance } from "../createApiClient";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    username: string;
    userType: "CHILD" | "ENGINEER" | "PARENT" | "ADMIN";
  };
}

export function createAuthApi(client: AxiosInstance) {
  return {
    login: (data: LoginRequest) => client.post<AuthResponse>("/auth/login", data),
    register: (data: RegisterRequest) => client.post<AuthResponse>("/auth/register", data),
    logout: () => client.post("/auth/logout"),
    refreshToken: (refreshToken: string) =>
      client.post<{ token: string }>("/auth/refresh", { refreshToken }),
  };
}
