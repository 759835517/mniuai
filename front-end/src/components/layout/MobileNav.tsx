"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, MessagesSquare, FolderKanban, Code2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const tabs = [
  { label: "工作台", href: "/dashboard", icon: LayoutDashboard },
  { label: "路线图", href: "/roadmap", icon: Map },
  { label: "教练", href: "/coach", icon: MessagesSquare },
  { label: "项目", href: "/projects", icon: FolderKanban },
  { label: "审查", href: "/review", icon: Code2 },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-[#30363D] bg-[#0D1117] lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      {tabs.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link key={tab.href} href={tab.href} className={cn("flex flex-1 flex-col items-center gap-1 py-2 text-[10px]", active ? "text-[#3B82F6]" : "text-[#8B949E]")}>
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
