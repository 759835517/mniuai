import Link from "next/link";

const TYPES = [
  {
    id: "algorithm",
    name: "算法面试",
    icon: "🧮",
    desc: "口述思路 + 现场编码，AI 动态调整难度",
    duration: "45分钟",
    weight: "35%",
  },
  {
    id: "system-design",
    name: "系统设计面试",
    icon: "🏗️",
    desc: "设计高并发系统，白板画架构图",
    duration: "45分钟",
    weight: "高级必备",
  },
  {
    id: "project",
    name: "项目深挖",
    icon: "🔍",
    desc: "基于简历项目，AI 追问技术细节和难点",
    duration: "30分钟",
    weight: "定制",
  },
  {
    id: "behavior",
    name: "行为面试",
    icon: "💬",
    desc: "STAR 原则回答，评估逻辑和表达",
    duration: "30分钟",
    weight: "20%",
  },
  {
    id: "comprehensive",
    name: "综合模拟",
    icon: "🎯",
    desc: "完整 1 小时流程：算法 + 系统设计 + 项目",
    duration: "60分钟",
    weight: "全真",
    popular: true,
  },
];

const COMPANIES = ["字节跳动", "阿里巴巴", "腾讯", "美团", "百度", "京东", "通用"];

export default function InterviewPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <section className="py-14 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            AI 面试官陪练
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            模拟真实技术面试，覆盖算法、系统设计、项目深挖与行为面试，面试后生成详细能力报告。
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">选择面试类型</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TYPES.map((t) => (
              <Link
                key={t.id}
                href={`/interview/new?type=${t.id}`}
                className="relative bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-400 hover:shadow-lg transition-all"
              >
                {t.popular && (
                  <span className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full bg-blue-500 text-white">
                    推荐
                  </span>
                )}
                <div className="text-3xl mb-3">{t.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{t.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{t.desc}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>⏱ {t.duration}</span>
                  <span>📊 {t.weight}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">目标公司（可选）</h3>
            <div className="flex flex-wrap gap-2">
              {COMPANIES.map((c) => (
                <span
                  key={c}
                  className="px-4 py-2 rounded-full bg-gray-100 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              选择目标公司后，AI 会从对应公司真题库抽题并模拟其面试风格。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
