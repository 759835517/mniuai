import Link from "next/link";

const FEATURES = [
  {
    id: "practice",
    name: "AI编程实战",
    icon: "⚡",
    desc: "真实开发场景：Bug修复、功能开发、重构，AI辅助如 Cursor 般高效",
    href: "/practice",
  },
  {
    id: "algorithms",
    name: "算法题库",
    icon: "🧩",
    desc: "精选500道高频面试题，AI逐级提示+视频讲解",
    href: "/algorithms",
  },
  {
    id: "interview",
    name: "AI面试官",
    icon: "🎤",
    desc: "算法+系统设计+项目深挖，动态追问，生成面试报告",
    href: "/interview",
  },
  {
    id: "system-design",
    name: "系统设计",
    icon: "🏗",
    desc: "秒杀/短链/限流器等7大经典题，白板绘图+AI评估",
    href: "/system-design",
  },
  {
    id: "code-review",
    name: "AI代码审查",
    icon: "🔍",
    desc: "安全/性能/可读性多维审查，提交PR前先过AI这关",
    href: "/code-review",
  },
  {
    id: "assessment",
    name: "能力诊断",
    icon: "📊",
    desc: "20道测评题，AI分析水平与薄弱项，推荐学习路径",
    href: "/assessment",
  },
];

const STATS = [
  { value: "20,000+", label: "在训工程师" },
  { value: "75%", label: "对赌涨薪达成率" },
  { value: "+35%", label: "面试通过率提升" },
  { value: "500", label: "精选算法题" },
];

const PATHS = [
  {
    id: "junior",
    name: "初级进阶路径",
    level: "1-3年",
    desc: "夯实算法基础，掌握AI编程，冲刺中级岗位",
    icon: "🌱",
  },
  {
    id: "senior",
    name: "中高级路径",
    level: "3-5年",
    desc: "系统设计+架构能力，冲刺大厂高级岗",
    icon: "🚀",
    popular: true,
  },
  {
    id: "interview-sprint",
    name: "面试冲刺路径",
    level: "全阶段",
    desc: "4周高强度面试特训，算法+系统设计+行为面",
    icon: "🎯",
  },
];

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 text-sm font-medium px-4 py-2 rounded-full mb-6">
            ⚡ AI驱动的工程师能力提升平台
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            3~6个月，完成技能升级
            <br />
            <span className="text-orange-400">跳槽涨薪 or 晋升</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            AI编程实战+算法题库+AI面试官+系统设计，对赌涨薪未达成全额退款。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/assessment"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
            >
              免费能力诊断 →
            </Link>
            <Link
              href="/practice"
              className="border border-gray-600 bg-white/5 hover:border-orange-400 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
            >
              体验AI编程实战
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-1">
                  {s.value}
                </div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 核心功能 */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            六大核心训练模块
          </h2>
          <p className="text-gray-500 text-center mb-10">
            从算法到工程，从编码到面试，覆盖工程师能力全链路
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <Link
                key={f.id}
                href={f.href}
                className="p-6 border-2 border-gray-100 rounded-2xl hover:border-orange-300 hover:shadow-lg transition-all"
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-bold text-gray-900 text-lg mt-4 mb-2">
                  {f.name}
                </h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 学习路径 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            选择你的进阶路径
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {PATHS.map((path) => (
              <Link
                key={path.id}
                href={`/paths`}
                className="relative p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-orange-300 hover:shadow-lg transition-all"
              >
                {path.popular && (
                  <span className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full bg-orange-500 text-white">
                    最热门
                  </span>
                )}
                <span className="text-3xl">{path.icon}</span>
                <h3 className="font-bold text-gray-900 text-lg mt-4 mb-1">
                  {path.name}
                </h3>
                <div className="text-xs text-gray-400 mb-3">
                  适合 {path.level}
                </div>
                <p className="text-sm text-gray-500">{path.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 对赌保障 */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-4xl mb-4">🤝</div>
          <h2 className="text-2xl font-bold mb-4">
            对赌涨薪：6个月未涨薪或晋升，全额退款
          </h2>
          <p className="text-gray-300 mb-8">
            完成学习要求，认真求职，6个月内未实现涨薪≥20%或内部晋升→全额退款。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { step: "1", title: "完成训练", desc: "150题+30实战+20轮面试" },
              { step: "2", title: "认真求职", desc: "投递≥30家，提供证明" },
              { step: "3", title: "未达成退款", desc: "9个月内申请，72h退款" },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-slate-800 rounded-xl p-4 text-left"
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
            查看完整对赌协议 →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-orange-500 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">免费体验14天，感受AI训练威力</h2>
          <p className="mb-8 opacity-90">
            注册即解锁全站14天，AI面试官+编程实战无限次，能力诊断永久免费
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
