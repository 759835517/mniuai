"use client";

const CONDITIONS = [
  { label: "工具使用次数", current: 34, target: 50, unit: "次", extra: "文档写作/数据分析/会议纪要等均计入" },
  { label: "完成学习任务", current: 1, target: 3, unit: "个", extra: "职场AI技能提升任务" },
  { label: "活跃天数", current: 42, target: 45, unit: "天", extra: "购买后90天内累计活跃天数" },
];

export default function MyGuaranteePage() {
  const met = CONDITIONS.filter((c) => c.current >= c.target).length;
  const pct = Math.round((met / CONDITIONS.length) * 100);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">对赌提效进度</h1>
        <p className="text-gray-500 mb-6">
          完成全部条件并认真使用工具，90天内仍感觉效率未提升，全额退款。
        </p>

        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">条件达成</span>
            <span className="text-2xl font-bold">{met}/{CONDITIONS.length}</span>
          </div>
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-sm mt-3 opacity-90">剩余申请期限：142 天（购买后 180 天内有效）</p>
        </div>

        <div className="space-y-3">
          {CONDITIONS.map((c) => {
            const done = c.current >= c.target;
            const ratio = Math.min(100, Math.round((c.current / c.target) * 100));
            return (
              <div key={c.label} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${done ? "bg-green-500" : "bg-gray-300"}`}>
                      {done ? "✓" : ""}
                    </span>
                    <span className="font-medium text-gray-900">{c.label}</span>
                  </div>
                  <span className="text-sm text-gray-500">{c.current}/{c.target} {c.unit}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${done ? "bg-green-500" : "bg-green-400"}`} style={{ width: `${ratio}%` }} />
                </div>
                {c.extra && <p className="text-xs text-gray-400 mt-1.5">{c.extra}</p>}
              </div>
            );
          })}
        </div>

        <button
          disabled={met < CONDITIONS.length}
          className={`w-full mt-6 py-3 rounded-full font-semibold transition-colors ${
            met < CONDITIONS.length
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {met < CONDITIONS.length ? "完成全部条件后可申请退款" : "申请对赌退款"}
        </button>
      </div>
    </div>
  );
}
