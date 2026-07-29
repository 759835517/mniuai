"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const PERSONAS = [
  {
    icon: "👨‍💻",
    label: "程序员",
    href: "/for/engineer",
    appUrl: process.env.NEXT_PUBLIC_ENGINEER_APP_URL || "https://app.mniuai.com",
    tagline: "AI编程 · 面试训练营",
    guarantee: "90天找到工作",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
    borderColor: "hover:border-blue-300",
  },
  {
    icon: "👶",
    label: "少儿编程",
    href: "/for/kids",
    appUrl: process.env.NEXT_PUBLIC_KIDS_APP_URL || "https://kids.mniuai.com",
    tagline: "竞赛获奖 · AI启蒙",
    guarantee: "竞赛获奖承诺",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50 hover:bg-green-100",
    borderColor: "hover:border-green-300",
  },
  {
    icon: "🎓",
    label: "大学生",
    href: "/for/campus",
    appUrl: process.env.NEXT_PUBLIC_CAMPUS_APP_URL || "https://campus.mniuai.com",
    tagline: "零基础就业保障",
    guarantee: "6个月就业",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
    borderColor: "hover:border-purple-300",
  },
  {
    icon: "👨‍🏫",
    label: "老师",
    href: "/for/teacher",
    appUrl: process.env.NEXT_PUBLIC_EDU_APP_URL || "https://edu.mniuai.com",
    tagline: "AI备课 · 效率提升",
    guarantee: "效率提升50%",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50 hover:bg-yellow-100",
    borderColor: "hover:border-yellow-300",
  },
  {
    icon: "📱",
    label: "自媒体",
    href: "/for/creator",
    appUrl: process.env.NEXT_PUBLIC_PRO_APP_URL || "https://pro.mniuai.com",
    tagline: "AI创作 · 涨粉增收",
    guarantee: "3个月增粉500",
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50 hover:bg-pink-100",
    borderColor: "hover:border-pink-300",
  },
  {
    icon: "🏪",
    label: "小老板",
    href: "/for/business",
    appUrl: process.env.NEXT_PUBLIC_PRO_APP_URL || "https://pro.mniuai.com",
    tagline: "AI获客 · 门店引流",
    guarantee: "1个月见效",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100",
    borderColor: "hover:border-orange-300",
  },
];

export function UserGroupGrid() {
  return (
    <section id="personas" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            找到适合你的 AI 学习路径
          </h2>
          <p className="text-gray-500 text-lg">
            为不同人群设计的专属 AI 课程体系，对赌协议保障学习效果
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PERSONAS.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <Link
                href={p.href}
                className={`block p-6 rounded-2xl border-2 border-transparent ${p.bgColor} ${p.borderColor} transition-all duration-200 group`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{p.label}</h3>
                    <p className="text-sm text-gray-600 mb-3">{p.tagline}</p>
                    <div className="inline-flex items-center gap-1 bg-white rounded-full px-3 py-1 text-xs font-medium text-gray-700 border border-gray-200">
                      🤝 {p.guarantee}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                  立即了解
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
