import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "定价套餐",
  description: "萌牛AI各端套餐价格对比，对赌协议保障学习效果，学不会全额退款。",
};

interface PricingPlan {
  name: string;
  persona: string;
  icon: string;
  price: number;
  originalPrice: number;
  period: string;
  description: string;
  features: string[];
  guarantee: string;
  ctaText: string;
  ctaUrl: string;
  popular?: boolean;
  color: string;
}

const PLANS: PricingPlan[] = [
  {
    name: "程序员AI训练营",
    persona: "程序员",
    icon: "👨‍💻",
    price: 1999,
    originalPrice: 2999,
    period: "12 周",
    description: "从传统开发到 AI 工程师的系统学习路径",
    features: [
      "AI 编程基础 + RAG/Agent 实战",
      "10 次+ 模拟面试辅导",
      "简历优化 + 内推资源",
      "3 个企业级作品集项目",
      "班主任 1v1 答疑",
    ],
    guarantee: "结业 90 天无 offer → 全额退款",
    ctaText: "立即报名",
    ctaUrl: process.env.NEXT_PUBLIC_ENGINEER_APP_URL || "https://app.mniuai.com",
    popular: true,
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "少儿 AI 编程竞赛班",
    persona: "少儿",
    icon: "👶",
    price: 2499,
    originalPrice: 3499,
    period: "16 周",
    description: "专业教研团队设计，覆盖 NOI / 信息学竞赛全路径",
    features: [
      "编程思维启蒙 + Python",
      "算法基础 + 竞赛真题",
      "AI 应用创作项目",
      "赛前心理辅导",
      "家长可陪同观看",
    ],
    guarantee: "未获省三等奖以上 → 全额退款",
    ctaText: "为孩子报名",
    ctaUrl: process.env.NEXT_PUBLIC_KIDS_APP_URL || "https://kids.mniuai.com",
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "大学生零基础就业班",
    persona: "大学生",
    icon: "🎓",
    price: 3999,
    originalPrice: 5999,
    period: "6 个月",
    description: "零基础系统学习 AI 应用开发，保障就业",
    features: [
      "编程基础 + Web 全栈",
      "AI 应用开发实战",
      "3 个作品集项目",
      "10 次+ 模拟面试",
      "就业后 30 天跟踪",
    ],
    guarantee: "毕业 180 天未就业 → 全额退款",
    ctaText: "开启就业之路",
    ctaUrl: process.env.NEXT_PUBLIC_CAMPUS_APP_URL || "https://campus.mniuai.com",
    color: "from-purple-500 to-violet-600",
  },
  {
    name: "教师 AI 备课效率课",
    persona: "老师",
    icon: "👨‍🏫",
    price: 399,
    originalPrice: 699,
    period: "4 周",
    description: "专为教师设计，快速上手 AI 备课、出题、批改全流程",
    features: [
      "AI 备课助手",
      "试卷题库生成",
      "作业批改辅助",
      "课件 AI 美化",
      "家校沟通模板库",
    ],
    guarantee: "工具使用 50 次自评无效 → 全额退款",
    ctaText: "开始提效",
    ctaUrl: process.env.NEXT_PUBLIC_EDU_APP_URL || "https://edu.mniuai.com",
    color: "from-yellow-500 to-amber-600",
  },
  {
    name: "自媒体 AI 创作涨粉课",
    persona: "自媒体",
    icon: "📱",
    price: 499,
    originalPrice: 899,
    period: "6 周",
    description: "公众号/小红书/视频号运营者专属，用 AI 降低创作成本",
    features: [
      "AI 选题与爆款分析",
      "AI 写作实战工作流",
      "AI 配图 + 视频脚本",
      "全媒体内容生产",
      "账号运营指导",
    ],
    guarantee: "3 个月增粉 < 500 → 全额退款",
    ctaText: "开始创作",
    ctaUrl: process.env.NEXT_PUBLIC_PRO_APP_URL || "https://pro.mniuai.com",
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "小老板 AI 获客课",
    persona: "小老板",
    icon: "🏪",
    price: 299,
    originalPrice: 499,
    period: "4 周",
    description: "实体店/服务业小老板专属，用 AI 做朋友圈文案、引流内容",
    features: [
      "朋友圈文案生成",
      "活动策划 AI 助手",
      "客户回复话术库",
      "本地化推广文案",
      "私域运营指导",
    ],
    guarantee: "30 次实操后自评无效 → 全额退款",
    ctaText: "开始获客",
    ctaUrl: process.env.NEXT_PUBLIC_PRO_APP_URL || "https://pro.mniuai.com",
    color: "from-orange-500 to-red-500",
  },
];

const FAQS = [
  {
    q: "对赌协议如何生效？",
    a: "报名后需满足学习门槛（如有效学时、模拟面试次数等），满足门槛后若效果未达标可申请全额退款。",
  },
  {
    q: "可以开发票吗？",
    a: "可以，报名后联系客服开具增值税普通发票。",
  },
  {
    q: "课程是直播还是录播？",
    a: "核心内容录播 + 每周直播答疑，录播可反复观看，直播回放保留。",
  },
  {
    q: "学完后有证书吗？",
    a: "完成课程后颁发萌牛AI结业证书，可作为简历加分项。",
  },
  {
    q: "可以分期付款吗？",
    a: "支持花呗、信用卡分期，具体请报名时选择。",
  },
];

export default function PricingPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            选择适合你的学习方案
          </h1>
          <p className="text-xl text-gray-500 mb-6">
            对赌协议保障，学不会全额退款，0 风险开始
          </p>
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-medium px-4 py-2 rounded-full">
            🔥 限时优惠中，所有课程立减 ¥300-¥2000
          </div>
        </div>
      </section>

      {/* 定价卡片 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white border-2 rounded-2xl p-6 transition-all hover:shadow-xl ${
                  plan.popular ? "border-orange-500 shadow-lg" : "border-gray-100"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    最受欢迎
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{plan.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{plan.name}</h3>
                    <span className="text-xs text-gray-500">{plan.persona} · {plan.period}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-orange-500">¥{plan.price}</span>
                    <span className="text-lg text-gray-400 line-through">¥{plan.originalPrice}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 mt-0.5">✅</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-4">
                  <div className="text-xs font-medium text-orange-700">🤝 {plan.guarantee}</div>
                </div>

                <a
                  href={`${plan.ctaUrl}/register`}
                  className={`block w-full text-center font-semibold py-3 rounded-xl transition-colors ${
                    plan.popular
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  {plan.ctaText}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 对赌协议说明 */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🤝 对赌协议保障</h2>
          <p className="text-gray-400 text-lg mb-8">我们敢用结果说话，学不会退全款</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "👨‍💻", title: "程序员", guarantee: "90 天无 offer 退款" },
              { icon: "👶", title: "少儿", guarantee: "竞赛未获奖退款" },
              { icon: "🎓", title: "大学生", guarantee: "180 天未就业退款" },
              { icon: "👨‍🏫", title: "老师", guarantee: "效率未提升退款" },
              { icon: "📱", title: "自媒体", guarantee: "增粉不足退款" },
              { icon: "🏪", title: "小老板", guarantee: "实操无效退款" },
            ].map((item) => (
              <div key={item.title} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <span className="text-2xl">{item.icon}</span>
                <div className="font-medium mt-2">{item.title}</div>
                <div className="text-xs text-orange-400 mt-1">{item.guarantee}</div>
              </div>
            ))}
          </div>

          <Link
            href="/guarantee"
            className="inline-flex items-center gap-2 mt-8 text-orange-400 hover:text-orange-300 text-sm underline underline-offset-2"
          >
            查看完整退款条款 →
          </Link>
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
                <p className="text-sm text-gray-600">A：{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-orange-500 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">准备好了吗？</h2>
          <p className="text-orange-100 mb-8">选择你的学习路径，对赌协议保障，0 风险开始</p>
          <Link
            href="/#personas"
            className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold px-8 py-4 rounded-full hover:bg-orange-50 transition-colors text-lg"
          >
            选择你的学习路径 →
          </Link>
        </div>
      </section>
    </div>
  );
}
