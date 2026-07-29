"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const HERO_PERSONAS = [
  { icon: "👨‍💻", label: "程序员", href: "#personas" },
  { icon: "👶", label: "少儿学编程", href: "#personas" },
  { icon: "🎓", label: "大学生", href: "#personas" },
  { icon: "👨‍🏫", label: "老师", href: "#personas" },
  { icon: "📱", label: "自媒体", href: "#personas" },
  { icon: "🏪", label: "小老板", href: "#personas" },
];

export function HeroSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] flex items-center pt-16 bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-hidden"
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-100 rounded-full opacity-40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 左侧文字 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
              🚀 AI，不只是程序员的专利
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              让每个人都能用{" "}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                AI
              </span>{" "}
              提升工作与生活
            </h1>

            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              萌牛AI 覆盖程序员、少儿、大学生、教师、自媒体等多个社会群体。
              <br />
              <strong className="text-gray-700">对赌协议保障</strong>，学不会全额退款。
            </p>

            <p className="text-base font-semibold text-gray-700 mb-4">你是谁？选择专属 AI 学习路径：</p>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 mb-8">
              {HERO_PERSONAS.map((p) => (
                <a
                  key={p.label}
                  href={p.href}
                  className="flex items-center gap-2 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-xl px-3 py-2.5 transition-all text-sm font-medium text-gray-700 hover:text-orange-600 group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {p.icon}
                  </span>
                  {p.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#personas"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full transition-colors text-center text-lg"
              >
                → 点击选择，获取专属 AI 学习路径
              </a>
            </div>
          </motion.div>

          {/* 右侧动画展示 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-xs text-gray-400 ml-2">萌牛AI · 学习中心</span>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: "👨‍💻", text: "程序员 · AI面试训练营 · 90天上岸", color: "bg-blue-50 text-blue-700" },
                    { icon: "👶", text: "少儿编程 · 竞赛获奖班 · 保障成绩", color: "bg-green-50 text-green-700" },
                    { icon: "🎓", text: "大学生 · 零基础就业班 · 6个月就业", color: "bg-purple-50 text-purple-700" },
                    { icon: "👨‍🏫", text: "教师 · AI备课工具 · 效率提升50%", color: "bg-yellow-50 text-yellow-700" },
                    { icon: "📱", text: "自媒体 · AI创作 · 3个月增粉500", color: "bg-pink-50 text-pink-700" },
                  ].map((item) => (
                    <div
                      key={item.text}
                      className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium ${item.color}`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="flex items-center gap-2 text-orange-700 text-sm font-medium">
                    🤝 <span>对赌协议保障 · 学不会全额退款</span>
                  </div>
                </div>
              </div>

              {/* 浮动装饰卡片 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-3 border border-gray-100"
              >
                <div className="text-sm font-bold text-gray-900">12,000+</div>
                <div className="text-xs text-gray-500">在学学员</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-orange-500 rounded-2xl shadow-lg p-3"
              >
                <div className="text-sm font-bold text-white">94%</div>
                <div className="text-xs text-orange-100">满意度</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
