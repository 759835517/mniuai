"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { kidsApi } from "@/lib/apiClient";
import type { KidsLearningPath } from "@mniuai/api-client";

/**
 * 少儿学习路径列表页
 * 展示所有已发布的少儿编程学习路径
 */
export default function PathsPage() {
  const [paths, setPaths] = useState<KidsLearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPaths();
  }, []);

  async function loadPaths() {
    try {
      setLoading(true);
      const data = await kidsApi.listLearningPaths();
      setPaths(data);
    } catch (err) {
      setError("加载学习路径失败，请稍后重试");
      console.error("Failed to load paths:", err);
    } finally {
      setLoading(false);
    }
  }

  // 阶段对应的颜色和描述
  const stageConfig: Record<string, { color: string; desc: string }> = {
    SCRATCH: { color: "bg-orange-100 text-orange-700", desc: "图形化编程" },
    PYTHON: { color: "bg-green-100 text-green-700", desc: "Python 编程" },
    ALGORITHM: { color: "bg-blue-100 text-blue-700", desc: "算法思维" },
    AI_CREATION: { color: "bg-purple-100 text-purple-700", desc: "AI 创作" },
    COMPETITION: { color: "bg-yellow-100 text-yellow-700", desc: "竞赛冲刺" },
  };

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
        <h2 className="text-3xl font-bold text-gray-800 mb-2">选择学习路径</h2>
        <p className="text-gray-600 mb-8">根据孩子的年龄和基础，选择最适合的学习路线</p>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paths.map((path) => {
              const stage = stageConfig[path.stage] || { color: "bg-gray-100 text-gray-700", desc: path.stage };
              return (
                <Link
                  key={path.id}
                  href={`/paths/${path.slug}`}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl group-hover:scale-110 transition-transform">{path.icon}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${stage.color}`}>
                      {stage.desc}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{path.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{path.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>📅 {path.durationWeeks} 周</span>
                    <span>📊 {path.levelFrom} → {path.levelTo}</span>
                    <span>👥 {path.studentCount} 人</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
