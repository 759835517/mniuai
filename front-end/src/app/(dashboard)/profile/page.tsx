"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/authStore";
import { growthApi } from "@/lib/api/growth";
import { userApi } from "@/lib/api/user";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/shared/Loading";
import XPBar from "@/components/growth/XPBar";
import LevelBadge from "@/components/growth/LevelBadge";
import StreakFire from "@/components/growth/StreakFire";
import AchievementWall from "@/components/growth/AchievementWall";
import ActivityChart from "@/components/growth/ActivityChart";
import type { GrowthProfile, Achievement } from "@/lib/types/growth";

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore();
  const [growth, setGrowth] = useState<GrowthProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      growthApi.getProfile().then(setGrowth).catch(() => {}),
      growthApi.getAchievements().then(setAchievements).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!nickname.trim()) return;
    setSaving(true);
    try {
      await userApi.updateMe({ nickname: nickname.trim() });
      await fetchMe();
      setEditing(false);
      toast.success("昵称已更新");
    } catch {
      toast.error("保存失败");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = () => {
    setNickname(user?.nickname || "");
    setEditing(true);
  };

  if (loading) return <Loading text="加载个人中心..." className="mt-12" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">个人中心</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: User Info */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-[#30363D] bg-[#161B22] p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <LevelBadge level={growth?.level ?? 1} size="lg" />
              </div>

              {editing ? (
                <div className="w-full space-y-2">
                  <Input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="输入昵称"
                    className="border-[#30363D] bg-[#0D1117] text-center text-[#F0F6FC]"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave} disabled={saving} className="flex-1 bg-[#3B82F6]">
                      {saving ? "保存中..." : "保存"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="flex-1 border-[#30363D]">
                      取消
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold">{user?.nickname || "未设置昵称"}</h2>
                  <p className="mt-1 text-sm text-[#8B949E]">{user?.email}</p>
                  <Button variant="outline" size="sm" onClick={startEdit} className="mt-3 border-[#30363D]">
                    编辑昵称
                  </Button>
                </>
              )}
            </div>
          </Card>

          {/* XP & Level */}
          {growth && (
            <Card className="border-[#30363D] bg-[#161B22] p-6">
              <h3 className="mb-4 font-semibold">等级信息</h3>
              <XPBar
                xp={growth.xp}
                level={growth.level}
                currentLevelXp={growth.currentLevelXp}
                nextLevelXp={growth.nextLevelXp}
                progressToNextLevel={growth.progressToNextLevel}
              />
            </Card>
          )}

          {/* Streak */}
          {growth && (
            <Card className="border-[#30363D] bg-[#161B22] p-6">
              <h3 className="mb-4 font-semibold">打卡记录</h3>
              <StreakFire currentStreak={growth.currentStreak} longestStreak={growth.longestStreak} showDetail />
            </Card>
          )}

          {/* Stats */}
          {growth && (
            <Card className="border-[#30363D] bg-[#161B22] p-6">
              <h3 className="mb-4 font-semibold">统计数据</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-[#8B949E]">完成项目</span>
                  <span className="text-sm font-medium">{growth.totalProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#8B949E]">代码审查</span>
                  <span className="text-sm font-medium">{growth.totalReviews}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#8B949E]">经验值</span>
                  <span className="text-sm font-medium">{growth.xp.toLocaleString()} XP</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right: Achievements + Activity */}
        <div className="space-y-6 lg:col-span-2">
          <AchievementWall achievements={achievements} />
          <ActivityChart />
        </div>
      </div>
    </div>
  );
}
