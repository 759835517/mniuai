"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard, Map, MessagesSquare, FolderKanban, Code2, User, Zap, Mic, ClipboardCheck,
  BookOpen, Settings, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/lib/stores/authStore";

const navItems = [
  { label: "工作台", href: "/dashboard", icon: LayoutDashboard },
  { label: "路线图", href: "/roadmap", icon: Map },
  { label: "课程中心", href: "/courses", icon: BookOpen },
  { label: "文章", href: "/articles", icon: FileText },
  { label: "AI 教练", href: "/coach", icon: MessagesSquare },
  { label: "项目", href: "/projects", icon: FolderKanban },
  { label: "代码审查", href: "/review", icon: Code2 },
  { label: "面试训练营", href: "/interview", icon: Mic },
  { label: "测验考试", href: "/quiz", icon: ClipboardCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const isAdmin = user?.roles?.includes("ADMIN");

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-[#30363D] lg:bg-[#0D1117]">
      <div className="flex h-16 items-center gap-2 px-6">
        <Zap className="h-6 w-6 text-[#3B82F6]" />
        <span className="text-lg font-bold">MNIU AI Camp</span>
      </div>
      <Separator className="bg-[#30363D]" />
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 text-sm",
                    active ? "bg-[#1C2128] text-[#F0F6FC]" : "text-[#8B949E] hover:bg-[#161B22] hover:text-[#F0F6FC]"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
          {isAdmin && (
            <Link href="/admin/courses">
              <Button
                variant={pathname.startsWith("/admin") ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 text-sm",
                  pathname.startsWith("/admin") ? "bg-[#1C2128] text-[#F0F6FC]" : "text-[#8B949E] hover:bg-[#161B22] hover:text-[#F0F6FC]"
                )}
              >
                <Settings className="h-4 w-4" />
                管理后台
              </Button>
            </Link>
          )}
        </nav>
      </ScrollArea>
      <Separator className="bg-[#30363D]" />
      <div className="p-3">
        <Link href="/profile">
          <Button variant="ghost" className="w-full justify-start gap-3 text-sm text-[#8B949E] hover:bg-[#161B22] hover:text-[#F0F6FC]">
            <User className="h-4 w-4" />
            个人中心
          </Button>
        </Link>
      </div>
    </aside>
  );
}
