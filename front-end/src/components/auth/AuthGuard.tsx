"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { initialized, isAuthenticated, hydrateFromStorage } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [initialized, isAuthenticated, router, pathname]);

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-mniu-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mniu-blue border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
