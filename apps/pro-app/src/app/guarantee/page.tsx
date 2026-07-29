import Link from "next/link";

const CONDITIONS = [
  { item: "工具使用次数", standard: "完成 ≥ 50 次 AI 工具调用（文档/分析/纪要等）" },
  { item: "完成学习任务", standard: "完成 ≥ 3 个职场 AI 技能提升任务" },
  { item: "活跃天数", standard: "工具使用 ≥ 45 天（购买后 90 天内）" },
  { item: "申请时限", standard: "购买后 180 天（6 个月）内提交申请" },
];

const STEPS = [
  { step: "1", title: "满足使用门槛", desc: "完成上述3项学习与使用条件" },
  { step: "2", title: "认真使用工具", desc: "持续使用工具，自评效率未提升" },
  { step: "3", title: "提交退款申请", desc: "填写无效反馈，说明使用感受" },
  { step: "4", title: "审核退款", desc: "人工审核1工作日，确认→48h退款" },
];

export default function GuaranteePage() {
  return (
    <div className="pt-16 min-h-screen">
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🤝</div>
          <h1 className="text-3xl font-bold mb-4">
            对赌提效协议：90天不提效，全额退款
          </h1>
          <p className="text-gray-300">
            认真使用我们的工具，如果90天后你仍然感觉工作效率未提升，我们承诺全额退款，无需理由。
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">退款条件（需同时满足）</h2>
          <div className="space-y-3">
            {CONDITIONS.map((c, i) => (
              <div key={c.item} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl">
                <span className="w-7 h-7 shrink-0 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <div>
                  <div className="font-semibold text-gray-900">{c.item}</div>
                  <div className="text-sm text-gray-500">{c.standard}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">退款流程</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            {STEPS.map((s) => (
              <div key={s.step} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="text-green-500 font-bold text-2xl mb-2">{s.step}</div>
                <div className="font-semibold text-gray-900 mb-1">{s.title}</div>
                <div className="text-sm text-gray-500">{s.desc}</div>
              </div>
            ))}
          </div>
          <div className="bg-green-50 rounded-xl p-6 text-sm text-gray-600 space-y-2">
            <p className="font-semibold text-gray-900">提效认定说明：</p>
            <p>• 本协议采用用户主观自评制，无需提供第三方证明</p>
            <p>• 只要你认真使用了工具，主观感受效率未提升，即可申请退款</p>
            <p>• 适用职位：所有职场岗位（产品/运营/市场/HR/设计等）</p>
            <p className="text-xs text-gray-400 pt-2">
              * 平台保留对明显滥用退款政策行为的审查权利，确保服务公平。
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-green-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">用实力对赌，提效更有底气</h2>
          <Link
            href="/pricing"
            className="inline-block bg-white text-green-700 font-semibold px-8 py-3 rounded-full hover:bg-green-50 transition-colors"
          >
            查看对赌提效版 →
          </Link>
        </div>
      </section>
    </div>
  );
}
