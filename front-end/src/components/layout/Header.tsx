"use client";

import { Bell, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/authStore";
import { useUiStore } from "@/lib/stores/uiStore";
import { useEffect } from "react";

export default function Header() {
  const { user, logout } = useAuthStore();
  const { unreadCount, fetchUnreadCount } = useUiStore();

  useEffect(() => { fetchUnreadCount(); }, [fetchUnreadCount]);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#30363D] bg-[#0D1117]/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3 lg:hidden">
        <Button variant="ghost" size="icon" className="text-[#8B949E]">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-[#8B949E]">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-[#8B949E] sm:block">{user?.nickname || user?.email}</span>
          <Button variant="ghost" size="icon" className="text-[#8B949E]" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
