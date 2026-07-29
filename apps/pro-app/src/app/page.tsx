import Link from "next/link";

const STATS = [
  { value: "50,000+", label: "职场用户" },
  { value: "10h/周", label: "平均节省时间" },
  { value: "6大", label: "AI效率工具" },
  { value: "98%", label: "用户满意度" },
];

const TOOLS = [
  { icon: "📝", title: "AI文档写作", desc: "PRD / 方案 / 报告 / 邮件，10分钟输出专业文档", href: "/writing" },
  { icon: "📊", title: "AI数据分析", desc: "上传Excel，自然语言提问，3秒获得数据洞察", href: "/data-analysis" },
  { icon: "🎙️", title: "AI会议纪要", desc: "粘贴会议记录，自动提取决策和待办事项", href: "/meeting" },
  { icon: "📄", title: "AI简历优化", desc: "针对目标JD优化简历，提升面试邀约率", href: "/resume" },
  { icon: "📈", title: "AI汇报材料", desc: "周报/月报/PPT大纲，告别废话汇报", href: "/report" },
  { icon: "📚", title: "职场模板库", desc: "30+职场文档模板，开箱即用", href: "/templates" },
];

const CASES = [
  { role: "产品经理", company: "某电商平台", result: "PRD 写作时间从 4 小时缩短到 45 分钟", avatar: "👩" },
  { role: "运营总监", company: "某 SaaS 公司", result: "每周节省 12 小时，晋升为运营VP", avatar: "👨" },
  { role: "市场专员", company: "某消费品牌", result: "月报制作从半天缩短到 30 分钟", avatar: "👩" },
];

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 to-teal-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            注册免费体验7天全功能
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            用AI提升职场效率<br />
            <span className="text-green-600">一周节省10小时</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            专为产品经理、运营、市场人员打造。AI文档写作、数据分析、会议纪要，让你把时间用在真正重要的事上。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              免费开始使用
            </Link>
            <Link
              href="/assessment"
              className="border border-gray-300 hover:border-green-400 text-gray-700 font-semibold px-8 py-3 rounded-full transition-colors"
            >
              职业能力诊断
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-green-600">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">6大AI效率工具</h2>
          <p className="text-gray-500 text-center mb-10">每个工具都深度优化职场场景，开箱即用</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOLS.map((t) => (
              <Link
                key={t.title}
                href={t.href}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:border-green-200 transition-all group"
              >
                <div className="text-3xl mb-3">{t.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                  {t.title}
                </h3>
                <p className="text-sm text-gray-500">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 对赌区块 */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-4xl mb-4">🤝</div>
          <h2 className="text-3xl font-bold mb-4">对赌提效协议：90天不提效，全额退款</h2>
          <p className="text-green-100 mb-6">
            认真使用我们的工具，如果你在90天内仍然感觉效率未提升，我们承诺全额退款。
          </p>
          <Link
            href="/guarantee"
            className="inline-block bg-white text-green-700 font-semibold px-8 py-3 rounded-full hover:bg-green-50 transition-colors"
          >
            查看对赌协议详情
          </Link>
        </div>
      </section>

      {/* 用户案例 */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">职场人的真实反馈</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CASES.map((c) => (
              <div key={c.role} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">
                    {c.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{c.role}</div>
                    <div className="text-xs text-gray-400">{c.company}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{c.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">立即开始，7天免费体验全部功能</h2>
          <p className="text-gray-400 mb-6">无需信用卡，注册即可使用</p>
          <Link
            href="/login"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-10 py-3 rounded-full transition-colors"
          >
            免费注册
          </Link>
        </div>
      </section>
    </div>
  );
}
