"use client";

import { Flame, FolderKanban, Code2, Trophy } from "lucide-react";
import type { GrowthProfile } from "@/lib/types/growth";

interface StatsOverviewProps {
  growth: GrowthProfile;
}

export default function StatsOverview({ growth }: StatsOverviewProps) {
  const stats = [
    { label: "经验值", value: `${growth.xp.toLocaleString()} XP`, icon: Flame, color: "text-[#F59E0B]" },
    { label: "完成项目", value: String(growth.totalProjects), icon: FolderKanban, color: "text-green-400" },
    { label: "代码审查", value: String(growth.totalReviews), icon: Code2, color: "text-[#3B82F6]" },
    { label: "最长打卡", value: `${growth.longestStreak} 天`, icon: Trophy, color: "text-[#8B5CF6]" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg border border-[#30363D] bg-[#161B22] p-4">
          <s.icon className={`mb-2 h-5 w-5 ${s.color}`} />
          <p className="text-lg font-bold">{s.value}</p>
          <p className="text-xs text-[#8B949E]">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
