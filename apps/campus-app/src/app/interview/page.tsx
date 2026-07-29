import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI面试官",
  description: "模拟真实面试场景，AI反馈+追问，提升面试通过率",
};

const INTERVIEW_TYPES = [
  {
    id: "algorithm",
    name: "算法面试",
    icon: "🧮",
    desc: "LeetCode风格算法题，限时作答，考官追问思路",
    duration: "45分钟",
    difficulty: "可调节",
    tags: ["数组", "链表", "树", "动态规划"],
  },
  {
    id: "project",
    name: "项目面试",
    icon: "🏗️",
    desc: "深挖你的项目经历，技术选型、难点解决、设计思路",
    duration: "30分钟",
    difficulty: "基于你的简历",
    tags: ["项目背景", "技术决策", "踩坑经历", "优化过程"],
  },
  {
    id: "behavioral",
    name: "行为面试",
    icon: "🎤",
    desc: "STAR法则结构化回答，职场情景模拟，沟通能力测评",
    duration: "20分钟",
    difficulty: "通用",
    tags: ["团队协作", "冲突处理", "自我介绍", "职业规划"],
  },
];

export default function InterviewPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">AI面试官</h1>
          <p className="text-gray-500">模拟真实面试场景，AI追问+即时反馈，提升面试通过率</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {INTERVIEW_TYPES.map((type) => (
            <Link
              key={type.id}
              href={`/interview/${type.id}-session`}
              className="bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all p-6"
            >
              <span className="text-4xl mb-4 block">{type.icon}</span>
              <h2 className="font-bold text-gray-900 text-lg mb-2">{type.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{type.desc}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {type.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-500 rounded">{tag}</span>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>⏱ {type.duration}</span>
                <span>难度: {type.difficulty}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">历史面试记录</h2>
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-3">🎯</div>
            <div className="text-sm">还没有面试记录，开始你的第一场模拟面试吧</div>
          </div>
        </div>
      </div>
    </div>
  );
}
