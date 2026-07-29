import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "对赌协议说明",
  description: "萌牛AI对赌协议详细条款，学不会全额退款，无理由，不废话。",
};

const GUARANTEE_ROWS = [
  {
    product: "程序员面试训练营",
    trigger: "结业 90 天无 offer",
    threshold: "有效学时 ≥ 80% + 模拟面试 ≥ 10 次",
    deadline: "结业后 120 天",
    icon: "👨‍💻",
  },
  {
    product: "少儿竞赛班",
    trigger: "未获省三等奖以上",
    threshold: "完课 + 参加认可竞赛",
    deadline: "竞赛结果公布后 30 天",
    icon: "👶",
  },
  {
    product: "大学生就业班",
    trigger: "180 天内未就业",
    threshold: "3 个作品 + 10 次模拟面试",
    deadline: "毕业后 210 天",
    icon: "🎓",
  },
  {
    product: "教师 AI 助手课",
    trigger: "工具使用 50 次自评无效",
    threshold: "30 天连续使用",
    deadline: "结业后 60 天",
    icon: "👨‍🏫",
  },
  {
    product: "自媒体增粉课",
    trigger: "3 个月增粉 < 500",
    threshold: "产出内容 ≥ 30 篇",
    deadline: "结课后 120 天",
    icon: "📱",
  },
];

const FAQS = [
  {
    q: "退款会影响我继续使用平台吗？",
    a: "退款后该课程访问权限取消，其他已购课程不受影响。退款后可重新报名任意课程。",
  },
  {
    q: "如果我中途放弃学习，也能退款吗？",
    a: "不能。退款需满足学习门槛（有效学时、模拟面试次数等），确保学员认真学习后效果仍不达标时才触发退款。",
  },
  {
    q: "退款审核需要多长时间？",
    a: "系统自动核查学习数据，满足条件后 72 小时内退款到账。如有争议可通过申诉通道联系人工审核。",
  },
  {
    q: "如果条款有争议怎么办？",
    a: "可通过 business@mniuai.com 或微信客服联系我们，工作日 24 小时内响应，协商无果可申请第三方仲裁。",
  },
];

export default function GuaranteePage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            我们敢用结果说话
          </h1>
          <p className="text-2xl text-orange-400 font-semibold mb-4">
            学不会，退全款
          </p>
          <p className="text-gray-400 text-lg">
            透明条款，自动核查，72 小时到账
          </p>
        </div>
      </section>

      {/* 退款条款表格 */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">各端退款条件</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="px-4 py-3 text-left font-semibold rounded-l-xl">产品</th>
                  <th className="px-4 py-3 text-left font-semibold">退款触发条件</th>
                  <th className="px-4 py-3 text-left font-semibold">学习认证门槛</th>
                  <th className="px-4 py-3 text-left font-semibold rounded-r-xl">申请截止</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {GUARANTEE_ROWS.map((row) => (
                  <tr key={row.product} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-900">
                      <span className="mr-2">{row.icon}</span>
                      {row.product}
                    </td>
                    <td className="px-4 py-4 text-orange-600 font-medium">{row.trigger}</td>
                    <td className="px-4 py-4 text-gray-600">{row.threshold}</td>
                    <td className="px-4 py-4 text-gray-500">{row.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 退款流程 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">退款流程</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {[
              { step: "1", label: "提交申请", icon: "📝" },
              { step: "2", label: "系统自动核查学习数据", icon: "🔍" },
              { step: "3", label: "满足条件 → 72h 退款", icon: "✅" },
              { step: "4", label: "不满足 → 告知缺口 + 申诉通道", icon: "💬" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs text-gray-500 mt-1 text-center max-w-[80px]">{item.label}</span>
                </div>
                {i < 2 && <span className="text-gray-300 text-2xl hidden sm:block">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">常见问题</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Q：{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-orange-500 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">准备好了吗？选择你的学习路径</h2>
          <Link
            href="/#personas"
            className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors"
          >
            查看全部课程 →
          </Link>
        </div>
      </section>
    </div>
  );
}
