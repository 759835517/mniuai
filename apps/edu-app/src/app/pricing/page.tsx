import Link from "next/link";

const PLANS = [
  {
    name: "免费版",
    price: "¥0",
    period: "",
    features: ["备课 5次/月", "出题 20题/月", "模板库（限量）"],
    excludes: ["AI批改", "PPT生成", "无限出题", "对赌保障"],
    cta: "注册即可使用",
    ctaHref: "/login",
    highlight: false,
  },
  {
    name: "基础版",
    price: "¥39",
    period: "/月",
    features: ["备课 30次/月", "出题 200题/月", "模板库全部解锁", "教案/试卷导出"],
    excludes: ["AI批改", "PPT生成", "对赌保障"],
    cta: "立即订阅",
    ctaHref: "/login",
    highlight: false,
  },
  {
    name: "专业版",
    price: "¥199",
    period: "/月",
    sub: "或 ¥1299/年（节省¥1089）",
    features: [
      "全功能无限制",
      "AI备课 不限次",
      "出题 不限量",
      "AI批改 100份/月",
      "PPT生成 不限",
      "模板库全解锁",
      "优先响应速度",
    ],
    excludes: [],
    cta: "开始7天免费体验",
    ctaHref: "/login",
    highlight: true,
    badge: "🤝 含对赌保障",
  },
  {
    name: "学校团队版",
    price: "询价",
    period: "",
    features: [
      "多账号管理",
      "学校品牌定制",
      "专属管理后台",
      "批量导入教师",
      "私有化部署可选",
    ],
    excludes: [],
    cta: "联系我们",
    ctaHref: "mailto:business@mniuai.com",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            选择适合你的计划
          </h1>
          <p className="text-gray-500">
            注册即送7天专业版体验 · 无需绑卡 · 随时取消
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 border-2 ${
                plan.highlight
                  ? "border-orange-500 bg-white shadow-lg"
                  : "border-gray-100 bg-white"
              }`}
            >
              {plan.highlight && (
                <div className="text-xs font-semibold text-white bg-orange-500 px-3 py-1 rounded-full inline-block mb-3">
                  推荐
                </div>
              )}
              <h2 className="font-bold text-gray-900 text-lg mb-1">
                {plan.name}
              </h2>
              <div className="mb-1">
                <span className="text-3xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-500 text-sm">{plan.period}</span>
              </div>
              {plan.sub && (
                <div className="text-xs text-gray-400 mb-3">{plan.sub}</div>
              )}
              {plan.badge && (
                <div className="text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg mb-4">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-2 mb-6 mt-4">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {f}
                  </div>
                ))}
                {plan.excludes.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="mt-0.5">✗</span>
                    {f}
                  </div>
                ))}
              </div>

              <Link
                href={plan.ctaHref}
                className={`block text-center font-semibold py-3 rounded-xl transition-colors text-sm ${
                  plan.highlight
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* 常见问题 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="font-bold text-xl text-gray-900 mb-6">常见问题</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                q: "如何触发对赌退款？",
                a: "专业版购买后60天内，累计有效使用≥50次、连续使用≥30天且用过≥3个工具，自评效率无提升可申请全额退款。",
              },
              {
                q: "免费体验结束后会删除数据吗？",
                a: "不会。体验期结束后降为免费版，你的教案和题库数据会一直保留。",
              },
              {
                q: "团队版支持哪些功能？",
                a: "多账号管理、学校品牌定制、管理后台、批量导入教师，还可选私有化部署。",
              },
              {
                q: "AI生成的内容版权属于谁？",
                a: "生成后保存到你的账号，你对内容拥有完整使用权。萌牛AI不会将你的内容用于其他用途。",
              },
            ].map((item) => (
              <div key={item.q}>
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
