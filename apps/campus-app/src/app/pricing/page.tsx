import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "订阅计划",
  description: "选择适合你的学习方案，就业保障版6个月未就业全额退款",
};

const PLANS = [
  {
    id: "free",
    name: "免费体验",
    price: "¥0",
    period: "7天",
    highlight: false,
    features: [
      "学习路径预览",
      "前10节课程免费",
      "每日3道练习题",
      "AI助教基础提示",
      "社区讨论",
    ],
    cta: "立即免费注册",
    href: "/login",
  },
  {
    id: "monthly",
    name: "月度订阅",
    price: "¥299",
    period: "/ 月",
    highlight: false,
    features: [
      "全部视频课程",
      "无限编程练习",
      "AI面试官（每月10次）",
      "AI助教无限次",
      "作品集托管",
      "简历生成器",
    ],
    cta: "开始学习",
    href: "/login",
  },
  {
    id: "guarantee",
    name: "就业保障版",
    price: "¥3,999",
    period: "全期",
    highlight: true,
    tag: "推荐",
    features: [
      "全部月度订阅功能",
      "AI面试官无限次",
      "1v1职业规划咨询（3次）",
      "简历专属优化",
      "内推资源对接",
      "6个月未就业全额退款",
      "就业数据跟踪报告",
    ],
    cta: "激活就业保障",
    href: "/login",
  },
  {
    id: "school",
    name: "高校/企业版",
    price: "联系我们",
    period: "",
    highlight: false,
    features: [
      "班级管理后台",
      "学员进度看板",
      "定制课程内容",
      "专属企业项目实训",
      "批量席位管理",
      "API集成支持",
    ],
    cta: "咨询定价",
    href: "/contact",
  },
];

export default function PricingPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">选择你的方案</h1>
          <p className="text-gray-500">就业保障版：完成学习6个月未就业，72小时全额退款</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl p-6 border-2 flex flex-col ${
                plan.highlight ? "border-blue-500 shadow-lg shadow-blue-100 relative" : "border-gray-100"
              }`}
            >
              {plan.highlight && plan.tag && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">{plan.tag}</span>
                </div>
              )}
              <div className="mb-5">
                <h2 className="font-bold text-gray-900 text-lg mb-2">{plan.name}</h2>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${plan.highlight ? "text-blue-500" : "text-gray-900"}`}>
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-400">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-400 mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block text-center font-semibold py-3 rounded-xl transition-colors ${
                  plan.highlight
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "border-2 border-gray-200 hover:border-blue-300 text-gray-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-gray-400">
          所有方案均支持支付宝/微信支付 · 企业版支持对公转账
        </div>
      </div>
    </div>
  );
}
