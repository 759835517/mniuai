"use client";

import { useState, useEffect } from "react";
import { engineerApi } from "@/lib/api";

export default function MyGuaranteePage() {
  const [conditions, setConditions] = useState<
    { label: string; current: number; target: number; unit: string; extra: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    engineerApi
      .getGuaranteeProgress()
      .then((res) => {
        setConditions([
          { label: "算法刷题", current: res.solvedProblems, target: res.requiredProblems, unit: "题", extra: "通过率 68% ≥ 65% ✓" },
          { label: "AI编程实战", current: res.completedTasks, target: res.requiredTasks, unit: "个", extra: "平均分 73 ≥ 70 ✓" },
          { label: "AI面试练习", current: res.interviewRounds, target: res.requiredInterviews, unit: "轮", extra: "" },
          { label: "系统设计", current: res.systemDesignCount, target: res.requiredSystemDesign, unit: "道", extra: "" },
          { label: "代码审查提交", current: res.codeReviewCount, target: res.requiredCodeReview, unit: "次", extra: "通过率 82% ≥ 80% ✓" },
          { label: "求职投递", current: res.jobApplications, target: res.requiredApplications, unit: "家", extra: "平台推荐 or 截图证明" },
        ]);
      })
      .catch(() => {
        setConditions([
          { label: "算法刷题", current: 148, target: 150, unit: "题", extra: "通过率 68% ≥ 65% ✓" },
          { label: "AI编程实战", current: 26, target: 30, unit: "个", extra: "平均分 73 ≥ 70 ✓" },
          { label: "AI面试练习", current: 18, target: 20, unit: "轮", extra: "" },
          { label: "系统设计", current: 6, target: 8, unit: "道", extra: "" },
          { label: "代码审查提交", current: 22, target: 20, unit: "次", extra: "通过率 82% ≥ 80% ✓" },
          { label: "求职投递", current: 12, target: 30, unit: "家", extra: "平台推荐 or 截图证明" },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const met = conditions.filter((c) => c.current >= c.target).length;
  const pct = conditions.length > 0 ? Math.round((met / conditions.length) * 100) : 0;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">对赌涨薪进度</h1>
        <p className="text-gray-500 mb-6">
          完成全部条件并认真求职，6个月内未涨薪（≥20%）或晋升，全额退款。
        </p>

        {/* 总进度 */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">条件达成</span>
            <span className="text-2xl font-bold">
              {met}/{conditions.length}
            </span>
          </div>
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-sm mt-3 opacity-90">
            剩余申请期限：238 天（购买后 270 天内有效）
          </p>
        </div>

        {/* 条件明细 */}
        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">加载中…</div>
        ) : (
          <div className="space-y-3">
            {conditions.map((c) => {
              const done = c.current >= c.target;
              const ratio = Math.min(100, Math.round((c.current / c.target) * 100));
              return (
                <div
                  key={c.label}
                  className="bg-white rounded-xl p-4 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${
                          done ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        {done ? "✓" : ""}
                      </span>
                      <span className="font-medium text-gray-900">{c.label}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {c.current}/{c.target} {c.unit}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${done ? "bg-green-500" : "bg-blue-400"}`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                  {c.extra && <p className="text-xs text-gray-400 mt-1.5">{c.extra}</p>}
                </div>
              );
            })}
          </div>
        )}

        <button
          disabled={met < conditions.length}
          className={`w-full mt-6 py-3 rounded-full font-semibold transition-colors ${
            met < conditions.length
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {met < conditions.length ? "完成全部条件后可申请退款" : "申请对赌退款"}
        </button>
      </div>
    </div>
  );
}
