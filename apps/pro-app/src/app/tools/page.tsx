import Link from "next/link";

const TOOLS = [
  { icon: "📝", title: "AI文档写作", desc: "PRD / 方案 / 报告 / 邮件", href: "/writing", category: "写作", color: "bg-blue-50 text-blue-600" },
  { icon: "📊", title: "AI数据分析", desc: "上传Excel，自然语言提问洞察", href: "/data-analysis", category: "分析", color: "bg-purple-50 text-purple-600" },
  { icon: "🎙️", title: "AI会议纪要", desc: "自动提取决策和Action Items", href: "/meeting", category: "沟通", color: "bg-teal-50 text-teal-600" },
  { icon: "📄", title: "AI简历优化", desc: "针对JD优化，提升面试邀约率", href: "/resume", category: "职业", color: "bg-orange-50 text-orange-600" },
  { icon: "📈", title: "AI汇报材料", desc: "周报/月报/述职PPT大纲", href: "/report", category: "写作", color: "bg-green-50 text-green-600" },
  { icon: "📚", title: "职场模板库", desc: "30+职场文档模板开箱即用", href: "/templates", category: "写作", color: "bg-pink-50 text-pink-600" },
];

const CATEGORIES = ["全部", "写作", "分析", "沟通", "职业"];

export default function ToolsPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">AI工具广场</h1>
          <p className="text-gray-500">6大核心职场场景，AI辅助完成每一份重要工作</p>
        </div>

        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {CATEGORIES.map((c) => (
            <span
              key={c}
              className="px-4 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-600 cursor-pointer hover:border-green-400 hover:text-green-600 transition-colors"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map((t) => (
            <Link
              key={t.title}
              href={t.href}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${t.color}`}>
                {t.icon}
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  {t.title}
                </h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {t.category}
                </span>
              </div>
              <p className="text-sm text-gray-500">{t.desc}</p>
              <div className="mt-4 text-sm text-green-600 font-medium group-hover:underline">
                立即使用 →
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 bg-green-50 rounded-2xl p-6 text-center">
          <p className="text-green-800 font-medium mb-3">还没有找到你需要的工具？</p>
          <Link href="/assessment" className="text-sm text-green-600 hover:underline">
            完成职业能力诊断，获取个性化推荐 →
          </Link>
        </div>
      </div>
    </div>
  );
}
