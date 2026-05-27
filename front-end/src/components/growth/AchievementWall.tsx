"use client";

import AchievementCard from "./AchievementCard";
import { Card } from "@/components/ui/card";
import type { Achievement } from "@/lib/types/growth";

interface AchievementWallProps {
  achievements: Achievement[];
}

export default function AchievementWall({ achievements }: AchievementWallProps) {
  return (
    <Card className="border-[#30363D] bg-[#161B22] p-6">
      <h3 className="mb-4 text-lg font-semibold">成就墙</h3>
      {achievements.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#8B949E]">暂无成就</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      )}
    </Card>
  );
}
