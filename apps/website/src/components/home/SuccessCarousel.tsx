"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STORIES = [
  {
    id: 1,
    name: "张同学",
    role: "后端工程师 → AI工程师",
    persona: "程序员",
    before: "工作3年的Java后端，感觉被AI时代抛下，投了40份简历无回音",
    after: "完成训练营3个月后，拿到字节跳动AI岗位 offer，薪资涨幅 60%",
    quote: "萌牛AI的对赌协议让我没有后顾之忧，课程质量超出预期，AI面试官练习非常真实。",
    avatar: "👨‍💻",
    bgColor: "from-blue-50 to-blue-100",
    accentColor: "text-blue-600",
  },
  {
    id: 2,
    name: "李老师",
    role: "初中语文教师",
    persona: "老师",
    before: "每天备课4小时，写教案、出题、批改作业占用大量时间，精力耗尽",
    after: "用 AI 备课效率提升 70%，每周节省 15 小时，还开设了校本 AI 课程",
    quote: "以前觉得 AI 是程序员的事，学完才发现教师用好 AI 收益更大。萌牛AI的老师课专门针对我们的场景设计。",
    avatar: "👨‍🏫",
    bgColor: "from-yellow-50 to-yellow-100",
    accentColor: "text-yellow-600",
  },
  {
    id: 3,
    name: "陈同学",
    role: "大学大三 → 互联网公司实习",
    persona: "大学生",
    before: "计算机专业大三，代码能力一般，担心毕业后找不到工作",
    after: "学习4个月后完成3个AI项目，在毕业前拿到两个实习 offer",
    quote: "我是零基础学 AI 应用开发的，老师讲得很系统。最关键的是对赌协议给了我信心，就算失败也不亏。",
    avatar: "🎓",
    bgColor: "from-purple-50 to-purple-100",
    accentColor: "text-purple-600",
  },
];

export function SuccessCarousel() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + STORIES.length) % STORIES.length);
  const next = () => setCurrent((c) => (c + 1) % STORIES.length);

  const story = STORIES[current];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">真实学员故事</h2>
          <p className="text-gray-500">他们用萌牛AI改变了职业轨迹</p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`bg-gradient-to-br ${story.bgColor} rounded-3xl p-8 md:p-10`}
            >
              <div className="flex items-start gap-4 mb-6">
                <span className="text-5xl">{story.avatar}</span>
                <div>
                  <div className="font-bold text-gray-900 text-xl">{story.name}</div>
                  <div className={`text-sm font-medium ${story.accentColor}`}>{story.role}</div>
                  <div className="inline-flex mt-1 text-xs text-gray-500 bg-white rounded-full px-3 py-1">
                    {story.persona}学员
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/70 rounded-2xl p-4">
                  <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">学习前</div>
                  <p className="text-sm text-gray-700">{story.before}</p>
                </div>
                <div className="bg-white/70 rounded-2xl p-4">
                  <div className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">学习后</div>
                  <p className="text-sm text-gray-700">{story.after}</p>
                </div>
              </div>

              <blockquote className="border-l-4 border-orange-400 pl-4 text-gray-600 italic text-sm leading-relaxed">
                "{story.quote}"
              </blockquote>
            </motion.div>
          </AnimatePresence>

          {/* 导航按钮 */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white rounded-full p-2 shadow-md hover:shadow-lg border border-gray-100 transition-shadow"
            aria-label="上一个"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white rounded-full p-2 shadow-md hover:shadow-lg border border-gray-100 transition-shadow"
            aria-label="下一个"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 指示点 */}
        <div className="flex justify-center gap-2 mt-6">
          {STORIES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? "w-6 bg-orange-500" : "bg-gray-300"
              }`}
              aria-label={`第 ${i + 1} 个案例`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
