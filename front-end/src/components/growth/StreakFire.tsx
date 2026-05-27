"use client";

import { Flame, Trophy } from "lucide-react";

interface StreakFireProps {
  currentStreak: number;
  longestStreak?: number;
  showDetail?: boolean;
}

export default function StreakFire({ currentStreak, longestStreak, showDetail }: StreakFireProps) {
  if (showDetail) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <Flame className={`mx-auto mb-1 h-6 w-6 ${currentStreak > 0 ? "text-[#F59E0B]" : "text-[#484F58]"}`} />
          <div className="text-xl font-bold">{currentStreak}</div>
          <div className="text-xs text-[#8B949E]">当前连续</div>
        </div>
        <div className="text-center">
          <Trophy className="mx-auto mb-1 h-6 w-6 text-[#8B5CF6]" />
          <div className="text-xl font-bold">{longestStreak ?? 0}</div>
          <div className="text-xs text-[#8B949E]">最长连续</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Flame className={`h-5 w-5 ${currentStreak > 0 ? "text-[#F59E0B]" : "text-[#484F58]"}`} />
        <div>
          <span className="text-lg font-bold">{currentStreak}</span>
          <span className="ml-1 text-xs text-[#8B949E]">天连续</span>
        </div>
      </div>
      {longestStreak !== undefined && (
        <div className="text-xs text-[#484F58]">最长 {longestStreak} 天</div>
      )}
    </div>
  );
}
