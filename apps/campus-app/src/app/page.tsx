import Link from "next/link";

const PATHS = [
  {
    id: "fullstack",
    name: "全栈工程师路径",
    duration: "12周",
    level: "L0→L4",
    icon: "💻",
    desc: "从零到全栈，完成2个真实项目",
    popular: true,
  },
  {
    id: "frontend",
    name: "前端工程师路径",
    duration: "10周",
    level: "L0→L3",
    icon: "🎨",
    desc: "React/Vue精通，完成作品集",
    popular: false,
  },
  {
    id: "backend-java",
    name: "Java后端路径",
    duration: "12周",
    level: "L0→L4",
    icon: "☕",
    desc: "Spring Boot企业级开发",
    popular: false,
  },
  {
    id: "data-analysis",
    name: "数据分析路径",
    duration: "8周",
    level: "L0→L3",
    icon: "📊",
    desc: "Python数据分析+BI可视化",
    popular: false,
  },
];

const STATS = [
  { value: "10,000+", label: "在学大学生" },
  { value: "70%", label: "6个月就业率" },
  { value: "¥12K", label: "平均起薪" },
  { value: "8%", label: "对赌退款率" },
];

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
            🎯 零基础到就业，AI全程陪伴
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            3~6个月，从零到
            <span className="text-blue-500">可就业工程师</span>
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
            视频课程+AI编程助手+真实项目+AI面试官，完成学习6个月未就业全额退款。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
            >
              免费体验7天 →
            </Link>
            <Link
              href="/paths"
              className="border border-gray-300 bg-white hover:border-blue-300 text-gray-700 font-semibold px-8 py-4 rounded-full text-lg transition-colors"
            >
              查看学习路径
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-1">
                  {s.value}
                </div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 学习路径 */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            选择适合你的学习路径
          </h2>
          <p className="text-gray-500 text-center mb-10">
            4条经过验证的就业路径，70%学员6个月内成功就业
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PATHS.map((path) => (
              <Link
                key={path.id}
                href={`/paths/${path.id}`}
                className="p-6 border-2 border-gray-100 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{path.icon}</span>
                  {path.popular && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-500 text-white">
                      最热门
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {path.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{path.desc}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>⏱ {path.duration}</span>
                  <span>📈 {path.level}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 对赌保障 */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-4xl mb-4">🤝</div>
          <h2 className="text-2xl font-bold mb-4">
            就业对赌协议：6个月未就业，全额退款
          </h2>
          <p className="text-gray-300 mb-8">
            完成全部学习要求，认真求职，6个月内仍未找到工作→全额退款。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { step: "1", title: "完成学习", desc: "视频80%+练习200题+项目2个" },
              { step: "2", title: "认真求职", desc: "投递≥50家，面试≥10轮" },
              {
                step: "3",
                title: "未就业退款",
                desc: "6个月内未就业，72h退款",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-gray-800 rounded-xl p-4 text-left"
              >
                <div className="text-blue-400 font-bold text-sm mb-1">
                  步骤{item.step}
                </div>
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-sm text-gray-400">{item.desc}</div>
              </div>
            ))}
          </div>
          <Link
            href="/guarantee"
            className="text-blue-400 hover:text-blue-300 text-sm underline"
          >
            查看完整对赌协议 →
          </Link>
        </div>
      </section>

      {/* 学员案例 */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            他们通过萌牛AI找到了第一份工作
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                name: "张同学",
                school: "某二本计算机专业",
                before: "大三开始学，投40份简历0面试",
                after: "完成全栈路径5个月，拿到字节实习Offer",
                salary: "月薪12K",
              },
              {
                name: "李同学",
                school: "非CS转行，工作2年",
                before: "想转行不知从哪开始",
                after: "6个月完成前端路径，入职某互联网公司",
                salary: "月薪15K",
              },
            ].map((story) => (
              <div
                key={story.name}
                className="bg-white rounded-2xl p-6 border border-blue-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                    👨‍💻
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{story.name}</div>
                    <div className="text-xs text-gray-500">{story.school}</div>
                  </div>
                  <div className="ml-auto text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    {story.salary}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="bg-red-50 rounded-lg p-3 text-xs text-gray-600">
                    <span className="font-medium text-red-500">学前：</span>
                    {story.before}
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-xs text-gray-600">
                    <span className="font-medium text-green-600">学后：</span>
                    {story.after}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-500 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">
            免费体验7天，感受AI陪伴学习
          </h2>
          <p className="mb-8 opacity-90">
            无需绑卡，注册即送就业版体验，支持全部功能
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors text-lg"
          >
            立即免费注册 →
          </Link>
        </div>
      </section>
    </div>
  );
}
