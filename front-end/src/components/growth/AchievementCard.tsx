"use client";

import { Star, Lock } from "lucide-react";
import type { Achievement } from "@/lib/types/growth";

interface AchievementCardProps {
  achievement: Achievement;
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <div
      className={`rounded-lg border p-4 transition-all ${
        achievement.unlocked
          ? "border-[#3B82F6]/30 bg-[#3B82F6]/5"
          : "border-[#30363D] bg-[#0D1117] opacity-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            achievement.unlocked ? "bg-[#3B82F6]/20" : "bg-[#1C2128]"
          }`}
        >
          {achievement.unlocked ? (
            <Star className="h-5 w-5 text-[#F59E0B]" />
          ) : (
            <Lock className="h-5 w-5 text-[#484F58]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-medium">{achievement.name}</h4>
          <p className="mt-0.5 text-xs text-[#8B949E]">{achievement.description}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-[#484F58]">
        <span>+{achievement.xpReward} XP</span>
        {achievement.unlocked && achievement.unlockedAt && <span>已解锁</span>}
      </div>
    </div>
  );
}
