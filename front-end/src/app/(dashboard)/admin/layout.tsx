"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { Card } from "@/components/ui/card";
import { BookOpen, FolderOpen, FileText } from "lucide-react";

const navItems = [
  { label: "课程管理", href: "/admin/courses", icon: BookOpen },
  { label: "章节管理", href: "/admin/lessons", icon: FolderOpen },
  { label: "文章管理", href: "/admin/articles", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!user?.roles?.includes("ADMIN")) {
      router.push("/dashboard");
      return;
    }
    setAuthorized(true);
  }, [isAuthenticated, user, router]);

  if (!authorized) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-[#8B949E]">无权限访问</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <aside className="w-48 shrink-0">
        <Card className="border-[#30363D] bg-[#161B22] p-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded px-3 py-2 text-sm ${
                    active ? "bg-[#3B82F6]/20 text-[#3B82F6]" : "text-[#8B949E] hover:bg-[#30363D]"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </Card>
      </aside>

      {/* Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
