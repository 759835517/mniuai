"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { campusApi, isLoggedIn, clearTokens } from "@/lib/api";

interface ProgressItem {
  pathId: string;
  pathName: string;
  courseCompletionPct: number;
  practiceCompleted: number;
  practicePassed: number;
  interviewRounds: number;
  resumeGenerated: boolean;
  enrolled: boolean;
}

export default function ProgressPage() {
  const router = useRouter();
  const [progressList, setProgressList] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    async function fetchProgress() {
      try {
        const data = await campusApi.getUserProgress();
        setProgressList(data || []);
      } catch (err: unknown) {
        const apiError = err as { error?: { message?: string } };
        setError(apiError?.error?.message || "获取学习进度失败");
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [router]);

  function handleLogout() {
    clearTokens();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-gray-500 mb-4">{error}</p>
          <Link href="/login" className="text-blue-500 underline">
            重新登录
          </Link>
        </div>
      </div>
    );
  }

  if (progressList.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">还没有报名学习路径</h2>
          <p className="text-gray-500 mb-6">
            选择一条适合你的学习路径，开始你的就业之旅
          </p>
          <Link
            href="/paths"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            浏览学习路径
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">我的学习进度</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            退出登录
          </button>
        </div>

        <div className="space-y-6">
          {progressList.map((progress) => {
            const coursePct = Math.round(progress.courseCompletionPct || 0);
            const practicePct = progress.practiceCompleted
              ? Math.min(100, Math.round((progress.practicePassed / Math.max(1, progress.practiceCompleted)) * 100))
              : 0;

            return (
              <div
                key={progress.pathId}
                className="bg-white rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    {progress.pathName}
                  </h2>
                  <Link
                    href={`/my/guarantee?slug=${progress.pathId}`}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    对赌进度 →
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{coursePct}%</div>
                    <div className="text-xs text-gray-500">课程完成</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {progress.practiceCompleted}
                    </div>
                    <div className="text-xs text-gray-500">已完成练习</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">
                      {progress.practicePassed}
                    </div>
                    <div className="text-xs text-gray-500">通过练习</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {progress.interviewRounds}
                    </div>
                    <div className="text-xs text-gray-500">AI面试轮数</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">课程进度</span>
                      <span className="text-xs font-medium text-blue-500">{coursePct}%</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 rounded-full h-2 transition-all"
                        style={{ width: `${coursePct}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">练习通过率</span>
                      <span className="text-xs font-medium text-green-500">{practicePct}%</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-green-500 rounded-full h-2 transition-all"
                        style={{ width: `${practicePct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {progress.resumeGenerated && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm text-green-700">
                    ✅ 简历已生成
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
