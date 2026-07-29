"use client";

import { useState, useEffect } from "react";
import { campusApi } from "@/lib/api";
import type { PortfolioDTO } from "@mniuai/api-client";
import Link from "next/link";

export default function PortfolioPage({ params }: { params: { username: string } }) {
  const [portfolio, setPortfolio] = useState<PortfolioDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        setLoading(true);
        const data = await campusApi.getPortfolio();
        setPortfolio(data);
      } catch (err) {
        console.error("Failed to fetch portfolio:", err);
        setError("获取作品集失败，请确保已登录");
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error || "无法加载作品集"}</p>
          <Link href="/login" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            去登录
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 mb-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl shrink-0">👨‍💻</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-gray-900">{portfolio.username}</h1>
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{portfolio.level}</span>
              </div>
              <div className="text-sm text-gray-500 mb-3">{portfolio.school} · {portfolio.pathName}</div>
              <p className="text-sm text-gray-600 mb-4">{portfolio.bio}</p>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.map((s) => (
                  <span key={s} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 text-center">
            <div><div className="text-xl font-bold text-gray-900">{portfolio.stats.practicePassed}</div><div className="text-xs text-gray-400">刷题通过</div></div>
            <div><div className="text-xl font-bold text-gray-900">{portfolio.stats.interviewRounds}</div><div className="text-xs text-gray-400">AI面试轮次</div></div>
            <div><div className="text-xl font-bold text-gray-900">{portfolio.stats.completedWeeks}周</div><div className="text-xs text-gray-400">完成课程</div></div>
            <div><div className="text-xl font-bold text-gray-900">{portfolio.stats.streakDays}天</div><div className="text-xs text-gray-400">最长连续打卡</div></div>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
          <h2 className="font-bold text-gray-900 mb-5">项目作品</h2>
          <div className="space-y-5">
            {portfolio.projects.map((proj) => (
              <div key={proj.id} className="border border-gray-100 rounded-xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                  <div className="flex gap-2">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-2 py-1 rounded">GitHub</a>
                    )}
                    {proj.demoUrl && (
                      <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-600 border border-blue-200 px-2 py-1 rounded">Demo</a>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3">{proj.description}</p>
                <div className="flex flex-wrap gap-1">
                  {proj.techStack.map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-500 rounded">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/resume" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm">
            生成简历 →
          </Link>
        </div>
      </div>
    </div>
  );
}
