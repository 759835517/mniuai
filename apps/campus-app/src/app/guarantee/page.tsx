import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "就业保障协议",
  description: "萌牛AI就业对赌协议完整条款",
};

const CONDITIONS = [
  { id: 1, icon: "🎓", title: "完成课程学习", desc: "完成所选路径视频课程 ≥80%，且每章节测验通过率 ≥60%", verified: "系统自动统计" },
  { id: 2, icon: "💻", title: "完成编程练习", desc: "在平台完成 ≥200 道编程题，其中中等及以上难度 ≥50道", verified: "系统自动统计" },
  { id: 3, icon: "🏗️", title: "完成项目实战", desc: "在规定时间内独立完成 2 个项目实战，通过导师评审", verified: "导师人工评审" },
  { id: 4, icon: "📝", title: "认真求职投递", desc: "在求职追踪器中记录投递 ≥50 家，并提供截图或链接佐证", verified: "人工抽检核实" },
  { id: 5, icon: "🎤", title: "积极参加面试", desc: "参加正式技术面试 ≥10 轮，在平台记录面试复盘", verified: "面试记录+佐证" },
];

export default function GuaranteePublicPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🤝</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">就业对赌协议</h1>
          <p className="text-gray-500">完成全部学习要求并积极求职，6个月内仍未就业→全额退款</p>
        </div>

        {/* Flow */}
        <div className="bg-blue-500 rounded-2xl p-6 text-white mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: "1", title: "购买保障版", desc: "选择「就业保障版」方案，激活对赌协议" },
              { step: "2", title: "完成学习+求职", desc: "满足5项条件，认真学习、积极投递" },
              { step: "3", title: "6个月保障期", desc: "仍未就业则申请退款，72小时内处理" },
            ].map((item) => (
              <div key={item.step} className="bg-white/10 rounded-xl p-4">
                <div className="text-blue-200 text-xs mb-1">步骤 {item.step}</div>
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-xs text-blue-100">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-5">退款必须满足的5项条件</h2>
          <div className="space-y-4">
            {CONDITIONS.map((c) => (
              <div key={c.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <span className="text-2xl shrink-0">{c.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">{c.title}</div>
                  <div className="text-sm text-gray-500 mb-1">{c.desc}</div>
                  <div className="text-xs text-blue-500">验证方式：{c.verified}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-4">常见问题</h2>
          <div className="space-y-4">
            {[
              { q: "\"就业\"的定义是什么？", a: "在中国大陆签署正式劳动合同，月薪 ≥8000元（北上广深杭）或 ≥6000元（其他城市），且与所学技术方向相关。" },
              { q: "退款金额是多少？", a: "退还全部课程费用（不含可能产生的第三方服务费）。" },
              { q: "如果中途放弃学习？", a: "中途停止学习或未满足学习条件，不满足退款条件，但可继续使用剩余有效期内的课程。" },
            ].map((item, i) => (
              <div key={i}>
                <div className="font-medium text-gray-900 text-sm mb-1">Q: {item.q}</div>
                <div className="text-sm text-gray-500">A: {item.a}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/pricing" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-full transition-colors">
            立即激活就业保障 →
          </Link>
        </div>
      </div>
    </div>
  );
}
