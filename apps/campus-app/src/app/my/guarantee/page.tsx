"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { campusApi, isLoggedIn } from "@/lib/api";

interface GuaranteeProgress {
  pathId: string;
  pathName: string;
  courseCompletionPct: number;
  practiceCompleted: number;
  practicePassed: number;
  interviewRounds: number;
  resumeGenerated: boolean;
  overallPct: number;
  allRequirementsMet: boolean;
}

// 对赌门槛定义
const CRITERIA = [
  { key: "courseCompletionPct", label: "完成课程视频 ≥80%", target: 80, unit: "%" },
  { key: "practiceCompleted", label: "完成编程练习 ≥200题", target: 200, unit: "题" },
  { key: "practicePassed", label: "通过练习 ≥120题", target: 120, unit: "题" },
  { key: "interviewRounds", label: "AI面试轮数 ≥10轮", target: 10, unit: "轮" },
  { key: "resumeGenerated", label: "生成求职简历", target: 1, unit: "份" },
];

export default function GuaranteePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "fullstack";

  const [progress, setProgress] = useState<GuaranteeProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    async function fetchProgress() {
      try {
        const data = await campusApi.getGuaranteeProgress(slug);
        setProgress(data);
      } catch (err: unknown) {
        const apiError = err as { error?: { message?: string } };
        setError(apiError?.error?.message || "获取对赌进度失败");
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [router, slug]);

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
          <Link href="/my/progress" className="text-blue-500 underline">
            返回学习进度
          </Link>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-gray-500">暂无对赌数据</p>
        </div>
      </div>
    );
  }

  // 计算各项达成情况
  const getCriteriaValue = (key: string): number => {
    switch (key) {
      case "courseCompletionPct":
        return Math.round(progress!.courseCompletionPct || 0);
      case "practiceCompleted":
        return progress!.practiceCompleted || 0;
      case "practicePassed":
        return progress!.practicePassed || 0;
      case "interviewRounds":
        return progress!.interviewRounds || 0;
      case "resumeGenerated":
        return progress!.resumeGenerated ? 1 : 0;
      default:
        return 0;
    }
  };

  const metCount = CRITERIA.filter((c) => getCriteriaValue(c.key) >= c.target).length;
  const overallPct = Math.round(progress.overallPct || 0);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/my/progress" className="text-sm text-blue-500 mb-4 inline-block">
          ← 返回学习进度
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">就业对赌进度</h1>
        <p className="text-gray-500 mb-8">
          {progress.pathName} · 满足所有条件后，6个月内未就业可申请全额退款
        </p>

        {/* 总体进度 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">总体完成率</h2>
            <span className="text-2xl font-bold text-blue-500">{overallPct}%</span>
          </div>
          <div className="bg-gray-100 rounded-full h-3 mb-2">
            <div
              className="bg-blue-500 rounded-full h-3 transition-all"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <div className="text-sm text-gray-500">
            {metCount}/{CRITERIA.length} 项条件已达成
          </div>
        </div>

        {/* 各项门槛 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">对赌条件达成情况</h2>
            <span className="text-sm text-gray-500">
              {metCount}/{CRITERIA.length} 达成
            </span>
          </div>
          <div className="space-y-5">
            {CRITERIA.map((c) => {
              const current = getCriteriaValue(c.key);
              const pct = Math.min(100, Math.round((current / c.target) * 100));
              const met = current >= c.target;
              return (
                <div key={c.key}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700 flex items-center gap-2">
                      {met ? "✅" : "⬜"} {c.label}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        met ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {current}/{c.target}
                      {c.unit}
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        met ? "bg-green-500" : "bg-blue-400"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {progress.allRequirementsMet ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-sm text-green-800">
            <div className="font-semibold mb-1">🎉 恭喜！已满足全部对赌条件</div>
            如在有效期内未就业，可申请全额退款。
            <Link href="/guarantee" className="text-blue-500 underline ml-1">
              查看完整协议
            </Link>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-sm text-yellow-800">
            <div className="font-semibold mb-1">⚠️ 退款申请须知</div>
            满足全部5项条件后，可在截止日期前通过「我的 → 退款申请」提交申请，审核72小时内完成退款。
            <Link href="/guarantee" className="text-blue-500 underline ml-1">
              查看完整协议
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
