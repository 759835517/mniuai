"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { kidsApi } from "@/lib/apiClient";
import type { CompetitionProblem } from "@mniuai/api-client";

/**
 * 竞赛题库列表页
 * 展示 CSP/NOI/蓝桥杯等竞赛题目，支持按难度和类别筛选
 */
export default function CompetitionPage() {
  const [problems, setProblems] = useState<CompetitionProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    loadProblems();
  }, [difficulty, category]);

  async function loadProblems() {
    try {
      setLoading(true);
      const params: { difficulty?: string; category?: string } = {};
      if (difficulty) params.difficulty = difficulty;
      if (category) params.category = category;
      const data = await kidsApi.listCompetitionProblems(params);
      setProblems(data);
    } catch (err) {
      setError("加载题目失败，请稍后重试");
      console.error("Failed to load problems:", err);
    } finally {
      setLoading(false);
    }
  }

  // 难度标签颜色
  const difficultyColors: Record<string, string> = {
    PRIMARY: "bg-green-100 text-green-700",
    JUNIOR: "bg-yellow-100 text-yellow-700",
    SENIOR: "bg-red-100 text-red-700",
  };

  const difficultyNames: Record<string, string> = {
    PRIMARY: "小学",
    JUNIOR: "初中",
    SENIOR: "高中",
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
        <h2 className="text-3xl font-bold text-gray-800 mb-2">竞赛题库</h2>
        <p className="text-gray-600 mb-6">CSP/NOI/蓝桥杯真题与模拟题，挑战编程思维极限</p>

        {/* 筛选栏 */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">难度</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">全部</option>
              <option value="PRIMARY">小学</option>
              <option value="JUNIOR">初中</option>
              <option value="SENIOR">高中</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">类别</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">全部</option>
              <option value="CSP">CSP</option>
              <option value="NOI">NOI</option>
              <option value="BLUE_BRIDGE">蓝桥杯</option>
            </select>
          </div>
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
          <div className="space-y-4">
            {problems.map((problem) => (
              <Link
                key={problem.id}
                href={`/competition/${problem.id}`}
                className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{problem.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{problem.content}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[problem.difficulty] || "bg-gray-100 text-gray-600"}`}>
                      {difficultyNames[problem.difficulty] || problem.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                      {problem.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {problems.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-3">📝</div>
                <p>暂无符合条件的题目</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
