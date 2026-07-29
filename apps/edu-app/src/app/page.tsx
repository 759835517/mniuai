import Link from "next/link";

const TOOLS = [
  {
    icon: "📝",
    title: "AI备课助手",
    desc: "输入课题，5分钟生成完整教案",
    href: "/tools/lesson",
    time: "≤15秒",
    color: "bg-orange-50 border-orange-100 hover:border-orange-300",
    badge: "最受欢迎",
    badgeColor: "bg-orange-500",
  },
  {
    icon: "📋",
    title: "AI出题机",
    desc: "按知识点、难度自动生成试题，一键组卷",
    href: "/tools/quiz",
    time: "≤8秒/10题",
    color: "bg-blue-50 border-blue-100 hover:border-blue-300",
    badge: "P0",
    badgeColor: "bg-blue-500",
  },
  {
    icon: "✅",
    title: "AI批改助手",
    desc: "上传作业图片，AI初审+评分，人工复核",
    href: "/tools/grade",
    time: "≤5秒/页",
    color: "bg-green-50 border-green-100 hover:border-green-300",
    badge: "P1",
    badgeColor: "bg-green-500",
  },
  {
    icon: "📊",
    title: "AI课件生成",
    desc: "输入课题，一键生成可下载的PPTX课件",
    href: "/tools/slides",
    time: "30秒",
    color: "bg-purple-50 border-purple-100 hover:border-purple-300",
    badge: "P1",
    badgeColor: "bg-purple-500",
  },
  {
    icon: "📚",
    title: "模板库",
    desc: "精选教案/试卷/通知模板，10分钟完成备课",
    href: "/templates",
    time: "即用",
    color: "bg-yellow-50 border-yellow-100 hover:border-yellow-300",
    badge: "",
    badgeColor: "",
  },
  {
    icon: "📁",
    title: "我的资料库",
    desc: "管理所有教案、题库和生成记录",
    href: "/my/lessons",
    time: "",
    color: "bg-gray-50 border-gray-100 hover:border-gray-300",
    badge: "",
    badgeColor: "",
  },
];

const STATS = [
  { value: "5000+", label: "教师在用" },
  { value: "70%", label: "备课时间节省" },
  { value: "10h+", label: "每周节省时长" },
  { value: "60天", label: "对赌退款保障" },
];

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
            🎯 专为教师设计的AI效率工具平台
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            AI帮你备课，
            <span className="text-orange-500">每周省出10小时</span>
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
            备课、出题、批改、课件制作全流程AI辅助。使用50次无效果，60天内全额退款。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/login"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
            >
              免费体验7天 →
            </Link>
            <Link
              href="/tools/lesson"
              className="border border-gray-300 bg-white hover:border-orange-300 text-gray-700 font-semibold px-8 py-4 rounded-full text-lg transition-colors"
            >
              先试试AI备课
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-1">
                  {s.value}
                </div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 工具卡片 */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            6大AI工具，覆盖教师全工作流
          </h2>
          <p className="text-gray-500 text-center mb-10">
            注册即送7天专业版体验，无需绑卡
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className={`p-6 border-2 rounded-2xl transition-all hover:shadow-lg ${tool.color}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{tool.icon}</span>
                  {tool.badge && (
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${tool.badgeColor}`}
                    >
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {tool.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{tool.desc}</p>
                {tool.time && (
                  <div className="text-xs font-medium text-gray-400">
                    ⚡ {tool.time}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 对赌保障 */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-4xl mb-4">🤝</div>
          <h2 className="text-2xl font-bold mb-4">对赌协议保障你的每一分投入</h2>
          <p className="text-gray-300 mb-8">
            购买专业版后，认真使用满50次仍觉得效率无提升，60天内申请全额退款。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { step: "1", title: "使用满50次", desc: "至少30天，覆盖3个工具" },
              { step: "2", title: "自评无效果", desc: "填写5题问卷说明情况" },
              {
                step: "3",
                title: "72小时退款",
                desc: "系统自动核查，极速到账",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-gray-800 rounded-xl p-4 text-left"
              >
                <div className="text-orange-400 font-bold text-sm mb-1">
                  步骤{item.step}
                </div>
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-sm text-gray-400">{item.desc}</div>
              </div>
            ))}
          </div>
          <Link
            href="/guarantee"
            className="text-orange-400 hover:text-orange-300 text-sm underline"
          >
            查看完整对赌协议条款 →
          </Link>
        </div>
      </section>

      {/* 真实案例 */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            5000+ 教师正在用萌牛AI省时间
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                name: "李老师",
                role: "初中语文，教龄12年",
                quote:
                  "以前备一节公开课要4小时，现在用AI生成框架再修改，1小时搞定。期末出卷子以前要一整天，现在30分钟。",
                saved: "每周节省15小时",
              },
              {
                name: "王老师",
                role: "小学数学，班主任",
                quote:
                  "AI出的题目质量让我很惊喜，知识点覆盖全，还会自动生成解析。批改30份作业以前要2小时，现在AI初审完我只需20分钟复核。",
                saved: "批改效率提升80%",
              },
            ].map((story) => (
              <div
                key={story.name}
                className="bg-white rounded-2xl p-6 border border-orange-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">
                    👩‍🏫
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{story.name}</div>
                    <div className="text-xs text-gray-500">{story.role}</div>
                  </div>
                  <div className="ml-auto text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    {story.saved}
                  </div>
                </div>
                <blockquote className="text-sm text-gray-600 italic leading-relaxed">
                  &quot;{story.quote}&quot;
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-orange-500 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">
            免费试用7天，感受AI为教学减负
          </h2>
          <p className="mb-8 opacity-90">
            无需绑卡，注册即送专业版体验，支持全部4大AI工具
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold px-8 py-4 rounded-full hover:bg-orange-50 transition-colors text-lg"
          >
            立即免费注册 →
          </Link>
        </div>
      </section>
    </div>
  );
}
