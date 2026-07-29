"use client";

import Link from "next/link";

export default function MyHistoryPage() {
  const usageStats = {
    totalUsage: 23,
    targetUsage: 50,
    continuousDays: 12,
    targetDays: 30,
    toolsUsed: 3,
    targetTools: 3,
    validSessions: 18,
    targetSessions: 30,
  };

  const progress = (usageStats.totalUsage / usageStats.targetUsage) * 100;
  const daysProgress = (usageStats.continuousDays / usageStats.targetDays) * 100;

  const recentActivity = [
    { tool: "AI备课助手", action: "生成教案《背影》", time: "2小时前", duration: "8分钟" },
    { tool: "AI出题机", action: "生成10道数学题", time: "昨天 14:23", duration: "5分钟" },
    { tool: "AI备课助手", action: "生成教案《光合作用》", time: "昨天 10:15", duration: "12分钟" },
    { tool: "AI批改助手", action: "批改30份作业", time: "2天前", duration: "25分钟" },
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">使用记录与对赌进度</h1>

        {/* 对赌进度卡片 */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">对赌达成进度</h2>
            <Link href="/guarantee" className="text-xs underline opacity-90 hover:opacity-100">
              查看协议详情
            </Link>
          </div>
          <div className="space-y-4">
            {/* 使用次数 */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>使用次数</span>
                <span className="font-semibold">
                  {usageStats.totalUsage} / {usageStats.targetUsage} 次
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* 连续天数 */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>连续使用天数</span>
                <span className="font-semibold">
                  {usageStats.continuousDays} / {usageStats.targetDays} 天
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all"
                  style={{ width: `${daysProgress}%` }}
                />
              </div>
            </div>

            {/* 其他条件 */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-xs opacity-75 mb-1">不同工具使用</div>
                <div className="font-semibold">
                  {usageStats.toolsUsed} / {usageStats.targetTools} 个 ✅
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-xs opacity-75 mb-1">有效使用时长</div>
                <div className="font-semibold">
                  {usageStats.validSessions} / {usageStats.targetSessions} 次
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-90">
            💡 继续使用 {usageStats.targetUsage - usageStats.totalUsage} 次 +{" "}
            {usageStats.targetDays - usageStats.continuousDays} 天即可达成对赌门槛
          </div>
        </div>

        {/* 使用统计 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">本月使用统计</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "总使用次数", value: "23次", icon: "⚡" },
              { label: "节省时间", value: "~12小时", icon: "⏱️" },
              { label: "生成教案", value: "8份", icon: "📝" },
              { label: "生成题目", value: "156道", icon: "📋" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近活动 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">最近活动</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm mb-1">
                    {activity.action}
                  </div>
                  <div className="text-xs text-gray-400">
                    {activity.tool} · {activity.time}
                  </div>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  {activity.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
