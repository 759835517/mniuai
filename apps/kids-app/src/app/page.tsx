"use client";

import Link from "next/link";

/**
 * 少儿端首页
 * 展示学习路径入口、平台介绍
 */
export default function KidsHomePage() {
  return (
    <div className="min-h-screen">
      {/* 顶部导航 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐮</span>
            <h1 className="text-xl font-bold text-indigo-600">萌牛 AI 少儿编程</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/paths" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
              学习路径
            </Link>
            <Link href="/competition" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
              竞赛题库
            </Link>
            <Link href="/badges" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
              我的勋章
            </Link>
            <Link
              href="/dashboard"
              className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-600 transition"
            >
              开始学习
            </Link>
          </nav>
        </div>
      </header>

      {/* 英雄区域 */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">🚀</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          让孩子爱上编程
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          从 Scratch 图形化编程到 Python 趣味代码，从算法思维到 AI 创作，
          专为 8-15 岁孩子设计的编程学习之旅
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/paths"
            className="bg-indigo-500 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-indigo-600 transition shadow-lg shadow-indigo-200"
          >
            选择学习路径
          </Link>
          <Link
            href="/competition"
            className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-indigo-50 transition border border-indigo-200"
          >
            挑战竞赛题
          </Link>
        </div>
      </section>

      {/* 学习阶段卡片 */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">五大成长阶段</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { icon: "🧩", name: "Scratch", desc: "图形化编程入门", color: "bg-orange-50 border-orange-200" },
            { icon: "🐍", name: "Python", desc: "趣味文字编程", color: "bg-green-50 border-green-200" },
            { icon: "🧠", name: "算法", desc: "逻辑思维训练", color: "bg-blue-50 border-blue-200" },
            { icon: "🤖", name: "AI 创作", desc: "人工智能启蒙", color: "bg-purple-50 border-purple-200" },
            { icon: "🏆", name: "竞赛", desc: "CSP/NOI 冲刺", color: "bg-yellow-50 border-yellow-200" },
          ].map((stage) => (
            <div
              key={stage.name}
              className={`${stage.color} border rounded-2xl p-6 text-center hover:scale-105 transition-transform cursor-pointer`}
            >
              <div className="text-4xl mb-3">{stage.icon}</div>
              <h4 className="font-bold text-gray-800 mb-1">{stage.name}</h4>
              <p className="text-sm text-gray-600">{stage.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 特色功能 */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">为什么选择萌牛？</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "🎮", title: "游戏化学习", desc: "像玩游戏一样学编程，每完成一个任务获得勋章奖励" },
            { icon: "👨‍🏫", title: "AI 助教陪伴", desc: "24 小时在线的 AI 编程老师，耐心解答每个问题" },
            { icon: "📊", title: "家长看得见", desc: "学习进度实时同步，家长随时了解孩子学习情况" },
          ].map((feature) => (
            <div key={feature.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h4 className="font-bold text-gray-800 mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 底部 */}
      <footer className="bg-white/60 border-t border-gray-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
          <p>© 2026 萌牛 AI 少儿编程 · 让孩子在快乐中学习编程</p>
        </div>
      </footer>
    </div>
  );
}
