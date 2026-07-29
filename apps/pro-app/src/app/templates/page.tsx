import Link from "next/link";

const TEMPLATES = [
  { icon: "📋", title: "产品需求文档（PRD）", category: "产品", uses: "12,400次", href: "/writing/prd" },
  { icon: "🎯", title: "OKR目标计划", category: "管理", uses: "8,200次", href: "/writing/plan" },
  { icon: "📅", title: "工作周报模板", category: "汇报", uses: "18,600次", href: "/report" },
  { icon: "✉️", title: "商务合作邮件", category: "邮件", uses: "6,800次", href: "/writing/email" },
  { icon: "🔍", title: "项目复盘报告", category: "汇报", uses: "5,100次", href: "/writing/report" },
  { icon: "📊", title: "数据分析报告", category: "分析", uses: "9,300次", href: "/data-analysis" },
  { icon: "🗺️", title: "项目规划方案", category: "产品", uses: "7,600次", href: "/writing/plan" },
  { icon: "👥", title: "团队招聘JD", category: "HR", uses: "4,200次", href: "/writing/plan" },
  { icon: "💡", title: "活动策划方案", category: "运营", uses: "11,400次", href: "/writing/plan" },
  { icon: "📈", title: "月度述职PPT大纲", category: "汇报", uses: "7,900次", href: "/report" },
  { icon: "🤝", title: "合作意向书", category: "邮件", uses: "3,800次", href: "/writing/email" },
  { icon: "📝", title: "竞品分析报告", category: "分析", uses: "6,500次", href: "/writing/report" },
];

const CATEGORIES = ["全部", "产品", "汇报", "分析", "运营", "邮件", "管理", "HR"];

export default function TemplatesPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">职场模板库</h1>
          <p className="text-gray-500">30+ 职场文档模板，AI 辅助一键生成</p>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map((t) => (
            <Link
              key={t.title}
              href={t.href}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-green-200 transition-all group flex items-start gap-4"
            >
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl shrink-0">
                {t.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-green-600 transition-colors truncate">
                    {t.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t.category}</span>
                  <span className="text-xs text-gray-400">已使用 {t.uses}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
