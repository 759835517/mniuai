"use client";

const STATS = [
  { label: "工具使用次数", value: "34", unit: "次", total: "/ 50 达标" },
  { label: "本周使用", value: "8", unit: "次", total: "" },
  { label: "最常用工具", value: "文档写作", unit: "", total: "" },
  { label: "节省时间（自评）", value: "6.5", unit: "h/周", total: "" },
];

const DIMS = [
  { label: "文档写作", value: 72 },
  { label: "数据分析", value: 48 },
  { label: "沟通汇报", value: 65 },
  { label: "项目管理", value: 55 },
  { label: "AI工具", value: 80 },
];

const RECENT = [
  { tool: "AI文档写作", action: "生成 PRD：积分体系", time: "2小时前" },
  { tool: "AI会议纪要", action: "整理 Q3策略会议纪要", time: "昨天" },
  { tool: "AI数据分析", action: "分析 6月销售数据", time: "3天前" },
  { tool: "AI简历优化", action: "针对字节跳动JD优化简历", time: "5天前" },
];

export default function MyProgressPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">使用进度</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">{s.label}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-green-600">{s.value}</span>
                <span className="text-xs text-gray-400">{s.unit}</span>
              </div>
              {s.total && <div className="text-xs text-gray-400 mt-0.5">{s.total}</div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">能力地图</h2>
            <div className="space-y-3">
              {DIMS.map((d) => (
                <div key={d.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{d.label}</span>
                    <span className="font-semibold text-gray-900">{d.value}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${d.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">薄弱项：数据分析。建议本周使用 AI数据分析 工具 2次。</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">最近使用记录</h2>
            <div className="space-y-3">
              {RECENT.map((r, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs text-green-700 font-bold shrink-0">
                    AI
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{r.action}</div>
                    <div className="text-xs text-gray-400">{r.tool} · {r.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-800">对赌进度提醒</h3>
              <p className="text-sm text-green-700 mt-0.5">已使用 34/50 次，还需 16 次即可满足对赌条件</p>
            </div>
            <a href="/my/guarantee" className="text-sm text-green-600 hover:underline font-medium">
              查看详情 →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
