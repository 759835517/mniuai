"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, MessagesSquare, FolderKanban, Code2 } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { useRoadmapStore } from "@/lib/stores/roadmapStore";
import { growthApi } from "@/lib/api/growth";
import type { GrowthProfile } from "@/lib/types/growth";
import ProgressTracker from "@/components/roadmap/ProgressTracker";
import XPBar from "@/components/growth/XPBar";
import StreakFire from "@/components/growth/StreakFire";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { activeRoadmap, progress, fetchActive } = useRoadmapStore();
  const [growth, setGrowth] = useState<GrowthProfile | null>(null);

  useEffect(() => {
    fetchActive();
    growthApi.getProfile().then(setGrowth).catch(() => {});
  }, [fetchActive]);

  const quickLinks = [
    { label: "学习路线图", desc: "生成个性化学习计划", href: "/roadmap", icon: Map, color: "text-blue-400" },
    { label: "AI 教练", desc: "与 AI 对话解决问题", href: "/coach", icon: MessagesSquare, color: "text-violet-400" },
    { label: "项目实战", desc: "创建 AI 项目", href: "/projects", icon: FolderKanban, color: "text-green-400" },
    { label: "代码审查", desc: "获取 AI 审查意见", href: "/review", icon: Code2, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {getGreeting()}，{user?.nickname || "开发者"}
          </h1>
          <p className="mt-1 text-sm text-[#8B949E]">继续你的 AI 学习之旅</p>
        </div>
        {growth && (
          <div className="hidden items-center gap-4 sm:flex">
            <XPBar
              xp={growth.xp}
              level={growth.level}
              currentLevelXp={growth.currentLevelXp}
              nextLevelXp={growth.nextLevelXp}
              progressToNextLevel={growth.progressToNextLevel}
            />
            <StreakFire currentStreak={growth.currentStreak} />
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Roadmap progress */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-lg font-semibold">学习进度</h2>
            {activeRoadmap ? (
              <div>
                <p className="mb-2 text-sm text-[#8B949E]">{activeRoadmap.roadmap.summary}</p>
                {progress && (
                  <ProgressTracker
                    completedTasks={progress.completedTasks}
                    totalTasks={progress.totalTasks}
                    completionRate={progress.completionRate}
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="mb-4 text-sm text-[#8B949E]">还没有学习路线图</p>
                <Link href="/roadmap">
                  <Button className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">生成学习路线图</Button>
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Right: Stats */}
        <div className="space-y-6">
          {growth && (
            <Card className="border-[#30363D] bg-[#161B22] p-6">
              <h2 className="mb-4 text-lg font-semibold">成长数据</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-[#8B949E]">经验值</span>
                  <span className="text-sm font-medium">{growth.xp.toLocaleString()} XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#8B949E]">完成项目</span>
                  <span className="text-sm font-medium">{growth.totalProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#8B949E]">代码审查</span>
                  <span className="text-sm font-medium">{growth.totalReviews}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#8B949E]">最长打卡</span>
                  <span className="text-sm font-medium">{growth.longestStreak} 天</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="cursor-pointer border-[#30363D] bg-[#161B22] p-5 transition-all hover:border-[#3B82F6]/30 hover:shadow-glow">
              <link.icon className={`mb-3 h-8 w-8 ${link.color}`} />
              <h3 className="font-semibold">{link.label}</h3>
              <p className="mt-1 text-xs text-[#8B949E]">{link.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "夜深了";
  if (h < 12) return "早上好";
  if (h < 18) return "下午好";
  return "晚上好";
}
