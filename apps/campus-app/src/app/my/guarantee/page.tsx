import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "就业对赌进度" };

const CRITERIA = [
  { id: 1, label: "完成课程视频 ≥80%", current: 38, target: 80, unit: "%" },
  { id: 2, label: "完成编程练习 ≥200题", current: 68, target: 200, unit: "题" },
  { id: 3, label: "完成2个项目实战", current: 0, target: 2, unit: "个" },
  { id: 4, label: "简历投递 ≥50家", current: 0, target: 50, unit: "家" },
  { id: 5, label: "参加面试 ≥10轮", current: 0, target: 10, unit: "轮" },
];

export default function GuaranteePage() {
  const startDate = "2026-05-01";
  const deadlineDate = "2026-11-01";
  const daysLeft = 97;
  const metCount = CRITERIA.filter((c) => c.current >= c.target).length;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">就业对赌进度</h1>
        <p className="text-gray-500 mb-8">满足所有条件后，6个月内未就业可申请全额退款</p>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">开始日期</div>
              <div className="font-semibold text-gray-900">{startDate}</div>
            </div>
            <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full relative">
              <div className="absolute inset-y-0 left-0 bg-blue-500 rounded-full" style={{ width: "27%" }} />
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-1">截止日期</div>
              <div className="font-semibold text-gray-900">{deadlineDate}</div>
            </div>
          </div>
          <div className="text-center text-sm text-blue-500 font-medium">剩余 {daysLeft} 天</div>
        </div>

        {/* Criteria */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">对赌条件达成情况</h2>
            <span className="text-sm text-gray-500">{metCount}/{CRITERIA.length} 达成</span>
          </div>
          <div className="space-y-5">
            {CRITERIA.map((c) => {
              const pct = Math.min(100, Math.round((c.current / c.target) * 100));
              const met = c.current >= c.target;
              return (
                <div key={c.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700 flex items-center gap-2">
                      {met ? "✅" : "⬜"} {c.label}
                    </span>
                    <span className={`text-xs font-semibold ${met ? "text-green-600" : "text-gray-500"}`}>
                      {c.current}/{c.target}{c.unit}
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${met ? "bg-green-500" : "bg-blue-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-sm text-yellow-800">
          <div className="font-semibold mb-1">⚠️ 退款申请须知</div>
          满足全部5项条件后，可在截止日期前通过「我的 → 退款申请」提交申请，审核72小时内完成退款。
          <Link href="/guarantee" className="text-blue-500 underline ml-1">查看完整协议</Link>
        </div>
      </div>
    </div>
  );
}
