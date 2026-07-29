import Link from "next/link";

const DOC_TYPES = [
  { slug: "prd", icon: "📋", title: "PRD 产品需求文档", desc: "输入产品名称和核心功能，AI生成完整需求文档框架", time: "约2分钟" },
  { slug: "report", icon: "📊", title: "工作报告", desc: "输入工作内容和数据，AI生成结构化工作汇报", time: "约1分钟" },
  { slug: "email", icon: "✉️", title: "商务邮件", desc: "输入收件人和目的，AI生成专业商务邮件", time: "约30秒" },
  { slug: "plan", icon: "🗺️", title: "项目方案", desc: "输入项目目标和背景，AI生成完整项目计划书", time: "约3分钟" },
];

export default function WritingPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">AI 文档写作</h1>
          <p className="text-gray-500">选择文档类型，填写核心信息，AI为你生成专业文档</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {DOC_TYPES.map((d) => (
            <Link
              key={d.slug}
              href={`/writing/${d.slug}`}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:border-green-200 transition-all group"
            >
              <div className="text-3xl mb-3">{d.icon}</div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  {d.title}
                </h3>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {d.time}
                </span>
              </div>
              <p className="text-sm text-gray-500">{d.desc}</p>
            </Link>
          ))}
        </div>
        <div className="mt-8 bg-green-50 border border-green-100 rounded-2xl p-5">
          <h3 className="font-semibold text-green-800 mb-1">模板说明</h3>
          <p className="text-sm text-green-700">
            所有文档均提供互联网/金融/零售/教育4大行业模板。生成后可在线编辑，一键复制或下载。
          </p>
        </div>
      </div>
    </div>
  );
}
