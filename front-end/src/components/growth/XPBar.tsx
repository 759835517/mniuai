"use client";

interface XPBarProps {
  xp: number;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressToNextLevel: number;
}

export default function XPBar({ xp, level, nextLevelXp, progressToNextLevel }: XPBarProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-sm font-bold text-[#3B82F6]">Lv.{level}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#1C2128]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] transition-all"
          style={{ width: `${progressToNextLevel * 100}%` }}
        />
      </div>
      <span className="shrink-0 text-xs text-[#8B949E]">
        {(xp ?? 0).toLocaleString()} / {(nextLevelXp ?? 0).toLocaleString()}
      </span>
    </div>
  );
}
