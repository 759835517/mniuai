"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { growthApi } from "@/lib/api/growth";
import type { GrowthStats } from "@/lib/types/growth";
import { Card } from "@/components/ui/card";

export default function ActivityChart() {
  const [stats, setStats] = useState<GrowthStats | null>(null);

  useEffect(() => {
    growthApi.getStats().then(setStats).catch(() => {});
  }, []);

  if (!stats) return null;

  const dailyXp = stats.dailyXp || [];
  const activityDistribution = stats.activityDistribution || [];

  return (
    <div className="space-y-4">
      {/* Daily XP Chart */}
      {dailyXp.length > 0 && (
        <Card className="border-[#30363D] bg-[#161B22] p-6">
          <h3 className="mb-4 text-sm font-semibold">每日经验值</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyXp}>
              <defs>
                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis
                dataKey="date"
                stroke="#484F58"
                fontSize={11}
                tickFormatter={(v: string) => v.slice(5)}
              />
              <YAxis stroke="#484F58" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "#161B22",
                  border: "1px solid #30363D",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#8B949E" }}
              />
              <Area type="monotone" dataKey="xp" stroke="#3B82F6" fill="url(#xpGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Activity Distribution */}
      {activityDistribution.length > 0 && (
        <Card className="border-[#30363D] bg-[#161B22] p-6">
          <h3 className="mb-4 text-sm font-semibold">活动分布</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis dataKey="type" stroke="#484F58" fontSize={11} />
              <YAxis stroke="#484F58" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "#161B22",
                  border: "1px solid #30363D",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}
