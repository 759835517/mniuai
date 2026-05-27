import { apiClient } from "@/lib/utils/apiClient";
import type { LoginRequest, RegisterRequest, TokenResponse, User } from "@/lib/types/user";

export const authApi = {
  register(payload: RegisterRequest): Promise<TokenResponse> {
    return apiClient.post("/auth/register", payload);
  },
  login(payload: LoginRequest): Promise<TokenResponse> {
    return apiClient.post("/auth/login", payload);
  },
  refresh(refreshToken: string): Promise<TokenResponse> {
    return apiClient.post("/auth/refresh", { refreshToken });
  },
  me(): Promise<User> {
    return apiClient.get("/users/me");
  },
};
