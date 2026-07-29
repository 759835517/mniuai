import Link from "next/link";

const PLANS = [
  {
    name: "免费版",
    price: "¥0",
    period: "",
    desc: "体验核心功能",
    features: ["每日1题算法", "AI提示5次/天", "能力诊断测评", "学习进度追踪"],
    cta: "免费注册",
    href: "/login",
    highlight: false,
  },
  {
    name: "基础版",
    price: "¥99",
    period: "/月",
    desc: "刷题面试主力",
    features: ["无限刷题+AI讲解", "10次AI面试/月", "系统设计题库", "面试报告分析"],
    cta: "订阅基础版",
    href: "/login",
    highlight: false,
  },
  {
    name: "进阶版",
    price: "¥199",
    period: "/月",
    desc: "全能力提升",
    features: ["基础版全部功能", "AI编程实战", "代码审查工具", "无限AI面试", "作品集展示"],
    cta: "订阅进阶版",
    href: "/login",
    highlight: true,
  },
  {
    name: "对赌涨薪版",
    price: "¥2,999",
    period: "/半年",
    desc: "涨薪或退款",
    features: [
      "进阶版全部功能",
      "专属学习规划",
      "一对一简历优化",
      "🤝 6个月未涨薪全额退款",
    ],
    cta: "了解对赌协议",
    href: "/guarantee",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">选择你的订阅计划</h1>
          <p className="text-gray-500">注册免费解锁全站14天，能力诊断永久免费</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 bg-white ${
                plan.highlight
                  ? "ring-2 ring-blue-500 shadow-lg relative"
                  : "border border-gray-100"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  最受欢迎
                </span>
              )}
              <h3 className="font-bold text-gray-900 text-lg mb-1">{plan.name}</h3>
              <p className="text-xs text-gray-400 mb-3">{plan.desc}</p>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-400 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block text-center py-2.5 rounded-full font-semibold text-sm transition-colors ${
                  plan.highlight
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "border border-gray-300 hover:border-blue-300 text-gray-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          企业版团队订阅、候选人面试能力评估，请
          <Link href="/login" className="text-blue-500 hover:underline mx-1">
            联系我们
          </Link>
          获取报价
        </p>
      </div>
    </div>
  );
}
