"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { kidsApi } from "@/lib/apiClient";
import type { KidsProgress } from "@mniuai/api-client";

/**
 * 少儿学习仪表盘
 * 展示学习进度、统计数据、快捷入口
 */
export default function DashboardPage() {
  const [progress, setProgress] = useState<KidsProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    try {
      setLoading(true);
      const data = await kidsApi.getUserProgress();
      setProgress(data);
    } catch (err) {
      setError("加载进度失败");
      console.error("Failed to load progress:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* 顶部导航 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐮</span>
            <span className="font-bold text-indigo-600">萌牛少儿编程</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-medium text-indigo-600">仪表盘</Link>
            <Link href="/paths" className="text-sm text-gray-500 hover:text-indigo-600">课程</Link>
            <Link href="/competition" className="text-sm text-gray-500 hover:text-indigo-600">竞赛</Link>
            <Link href="/badges" className="text-sm text-gray-500 hover:text-indigo-600">勋章</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">👋 你好，小小程序员！</h2>

        {loading && (
          <div className="text-center py-12">
            <div className="text-4xl animate-bounce">⏳</div>
            <p className="text-gray-500 mt-4">加载中...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-center">
            {error}
          </div>
        )}

        {progress && !loading && (
          <>
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon="📚" label="学习路径" value={progress.totalPaths} />
              <StatCard icon="💻" label="代码提交" value={progress.totalPractice} />
              <StatCard icon="✅" label="通过题目" value={progress.passedPractice} />
              <StatCard icon="🏅" label="获得勋章" value={progress.earnedBadges} />
            </div>

            {/* 快捷入口 */}
            <h3 className="text-lg font-bold text-gray-800 mb-4">快捷入口</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickLink
                href="/paths"
                icon="🧩"
                title="继续学习"
                desc="选择一个学习路径开始编程之旅"
                color="bg-indigo-50 border-indigo-200"
              />
              <QuickLink
                href="/competition"
                icon="🏆"
                title="挑战竞赛"
                desc="试试 CSP/NOI 竞赛题目"
                color="bg-yellow-50 border-yellow-200"
              />
              <QuickLink
                href="/badges"
                icon="🏅"
                title="查看勋章"
                desc="看看你获得了哪些成就"
                color="bg-green-50 border-green-200"
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

/**
 * 统计卡片组件
 */
function StatCard({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-indigo-600">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

/**
 * 快捷入口组件
 */
function QuickLink({ href, icon, title, desc, color }: {
  href: string; icon: string; title: string; desc: string; color: string;
}) {
  return (
    <Link href={href} className={`${color} border rounded-xl p-5 hover:shadow-md transition`}>
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="font-bold text-gray-800 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{desc}</p>
    </Link>
  );
}
