import Link from "next/link";

const CONDITIONS = [
  { item: "算法刷题", standard: "完成 ≥ 150 道题，通过率 ≥ 65%" },
  { item: "AI编程实战", standard: "完成 ≥ 30 个任务，平均分 ≥ 70" },
  { item: "AI面试练习", standard: "完成 ≥ 20 轮模拟面试" },
  { item: "系统设计", standard: "完成 ≥ 8 道系统设计题" },
  { item: "代码审查", standard: "提交 ≥ 20 次代码，AI审查通过率 ≥ 80%" },
  { item: "活跃度", standard: "每周至少学习 3 次，无连续断更 ≥ 3 周" },
  { item: "求职行为", standard: "投递简历 ≥ 30 家（平台推荐或截图证明）" },
  { item: "申请时限", standard: "购买后 270 天（9个月）内申请" },
];

const STEPS = [
  { step: "1", title: "完成学习门槛", desc: "达成上述8项学习与活跃条件" },
  { step: "2", title: "认真求职", desc: "投递≥30家，保留投递与面试记录" },
  { step: "3", title: "提交证明", desc: "上传求职记录 + 收入/Offer对比证明" },
  { step: "4", title: "审核退款", desc: "人工审核3工作日，确认未涨薪→72h退款" },
];

export default function GuaranteePage() {
  return (
    <div className="pt-16 min-h-screen">
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🤝</div>
          <h1 className="text-3xl font-bold mb-4">
            对赌涨薪协议：6个月未涨薪，全额退款
          </h1>
          <p className="text-gray-300">
            完成全部学习要求并认真求职，6个月内仍未实现涨薪（跳槽涨幅≥20%或内部晋升）→ 全额退款。
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            退款条件（需同时满足）
          </h2>
          <div className="space-y-3">
            {CONDITIONS.map((c, i) => (
              <div
                key={c.item}
                className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl"
              >
                <span className="w-7 h-7 shrink-0 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
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
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            涨薪认定与退款流程
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            {STEPS.map((s) => (
              <div key={s.step} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="text-blue-500 font-bold text-2xl mb-2">{s.step}</div>
                <div className="font-semibold text-gray-900 mb-1">{s.title}</div>
                <div className="text-sm text-gray-500">{s.desc}</div>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 rounded-xl p-6 text-sm text-gray-600 space-y-2">
            <p className="font-semibold text-gray-900">涨薪认定范围：</p>
            <p>• 跳槽涨薪：新Offer薪资比当前涨幅 ≥ 20%（提供Offer截图）</p>
            <p>• 内部晋升：晋升通知邮件 + 调薪记录</p>
            <p>• 适用岗位：技术岗位（开发/测试/架构/算法等）</p>
            <p className="text-xs text-gray-400 pt-2">
              * 为防范虚假投递与Offer造假，平台将随机抽查投递真实性并交叉验证Offer信息。
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-blue-500 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">用实力对赌，涨薪更有底气</h2>
          <Link
            href="/pricing"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors"
          >
            查看对赌涨薪版 →
          </Link>
        </div>
      </section>
    </div>
  );
}
