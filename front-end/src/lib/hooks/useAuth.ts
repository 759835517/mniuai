import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/authStore";

export function useAuthGuard() {
  const { initialized, isAuthenticated, hydrateFromStorage } = useAuthStore();

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  return { initialized, isAuthenticated };
}
