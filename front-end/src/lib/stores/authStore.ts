import { create } from "zustand";
import type { User, LoginRequest, RegisterRequest } from "@/lib/types/user";
import { authApi } from "@/lib/api/auth";
import { tokenStorage } from "@/lib/utils/tokenStorage";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  initialized: boolean;
  loading: boolean;
  error: string | null;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
  hydrateFromStorage: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  initialized: false,
  loading: false,
  error: null,

  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const tokens = await authApi.login(payload);
      tokenStorage.setAccessToken(tokens.accessToken);
      if (tokens.refreshToken) tokenStorage.setRefreshToken(tokens.refreshToken);
      const user = await authApi.me();
      set({ user, isAuthenticated: true, loading: false, initialized: true });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
      throw e;
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const tokens = await authApi.register(payload);
      tokenStorage.setAccessToken(tokens.accessToken);
      if (tokens.refreshToken) tokenStorage.setRefreshToken(tokens.refreshToken);
      const user = await authApi.me();
      set({ user, isAuthenticated: true, loading: false, initialized: true });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
      throw e;
    }
  },

  fetchMe: async () => {
    try {
      const user = await authApi.me();
      set({ user, isAuthenticated: true, initialized: true });
    } catch {
      tokenStorage.clear();
      set({ user: null, isAuthenticated: false, initialized: true });
    }
  },

  logout: () => {
    tokenStorage.clear();
    set({ user: null, isAuthenticated: false });
    if (typeof window !== "undefined") window.location.href = "/login";
  },

  hydrateFromStorage: () => {
    if (get().initialized) return;
    const token = tokenStorage.getAccessToken();
    if (token) {
      set({ initialized: true });
      get().fetchMe();
    } else {
      set({ initialized: true, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),
}));
