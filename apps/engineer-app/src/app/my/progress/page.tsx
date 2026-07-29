"use client";

const RADAR = [
  { label: "算法", value: 72 },
  { label: "系统设计", value: 55 },
  { label: "AI编程", value: 80 },
  { label: "代码质量", value: 68 },
  { label: "面试表达", value: 60 },
];

const STATS = [
  { label: "已刷算法题", value: "148", total: "/ 500" },
  { label: "实战任务", value: "26", total: "个完成" },
  { label: "模拟面试", value: "18", total: "轮" },
  { label: "系统设计", value: "6", total: "道" },
];

// 近12周活跃热力图（0-4 级）
const HEATMAP = [
  [1, 2, 0, 3, 4, 2, 1],
  [0, 1, 3, 2, 4, 3, 2],
  [2, 3, 4, 1, 0, 2, 3],
  [1, 0, 2, 3, 4, 4, 2],
];

const HEAT_COLORS = ["bg-gray-100", "bg-blue-100", "bg-blue-200", "bg-blue-400", "bg-blue-600"];

export default function ProgressPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">学习进度</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">{s.label}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-blue-500">{s.value}</span>
                <span className="text-xs text-gray-400">{s.total}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 能力雷达 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">能力雷达</h2>
            <div className="space-y-3">
              {RADAR.map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{r.label}</span>
                    <span className="font-semibold text-gray-900">{r.value}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${r.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">
              薄弱项：系统设计。建议本周攻克「限流器 / 秒杀系统」两道题。
            </p>
          </div>

          {/* 活跃热力图 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">近4周活跃</h2>
            <div className="space-y-2">
              {HEATMAP.map((week, wi) => (
                <div key={wi} className="flex gap-2">
                  {week.map((level, di) => (
                    <div
                      key={di}
                      className={`w-9 h-9 rounded-md ${HEAT_COLORS[level]}`}
                      title={`活跃度 ${level}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 mt-4 text-xs text-gray-400">
              <span>少</span>
              {HEAT_COLORS.map((c, i) => (
                <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
              ))}
              <span>多</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
