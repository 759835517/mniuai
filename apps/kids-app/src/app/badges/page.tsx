"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { kidsApi } from "@/lib/apiClient";
import type { GrowthBadge } from "@mniuai/api-client";

/**
 * 我的勋章页
 * 展示用户已获得的勋章和未解锁勋章
 */
export default function BadgesPage() {
  const [badges, setBadges] = useState<GrowthBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBadges();
  }, []);

  async function loadBadges() {
    try {
      setLoading(true);
      const data = await kidsApi.listBadges();
      setBadges(data);
    } catch (err) {
      setError("加载勋章失败");
      console.error("Failed to load badges:", err);
    } finally {
      setLoading(false);
    }
  }

  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="min-h-screen">
      {/* 顶部导航 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐮</span>
            <span className="font-bold text-indigo-600">萌牛少儿编程</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-indigo-600">
            ← 返回首页
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">我的勋章</h2>
          <p className="text-gray-600">
            已获得 <span className="text-indigo-600 font-bold">{earnedCount}</span> / {badges.length} 枚勋章
          </p>
        </div>

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

        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-2xl p-5 text-center border transition ${
                  badge.earned
                    ? "bg-white border-indigo-200 shadow-sm"
                    : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                <div className={`text-4xl mb-2 ${badge.earned ? "" : "grayscale"}`}>
                  {badge.icon}
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">{badge.name}</h4>
                <p className="text-xs text-gray-500">{badge.description}</p>
                {badge.earned && (
                  <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    ✅ 已获得
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
