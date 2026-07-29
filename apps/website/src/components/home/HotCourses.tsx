import Link from "next/link";

const HOT_COURSES = [
  {
    id: "ai-engineer-bootcamp",
    title: "AI 工程师面试训练营",
    persona: "程序员",
    personaColor: "bg-blue-100 text-blue-700",
    difficulty: "进阶",
    duration: "12 周",
    price: 1999,
    originalPrice: 2999,
    students: 3240,
    guarantee: true,
    emoji: "👨‍💻",
  },
  {
    id: "kids-ai-competition",
    title: "少儿 AI 编程竞赛班",
    persona: "少儿",
    personaColor: "bg-green-100 text-green-700",
    difficulty: "入门",
    duration: "16 周",
    price: 2499,
    originalPrice: 3499,
    students: 1820,
    guarantee: true,
    emoji: "👶",
  },
  {
    id: "campus-zero-to-job",
    title: "大学生零基础就业班",
    persona: "大学生",
    personaColor: "bg-purple-100 text-purple-700",
    difficulty: "入门",
    duration: "6 个月",
    price: 3999,
    originalPrice: 5999,
    students: 2150,
    guarantee: true,
    emoji: "🎓",
  },
  {
    id: "teacher-ai-tools",
    title: "教师 AI 备课效率课",
    persona: "老师",
    personaColor: "bg-yellow-100 text-yellow-700",
    difficulty: "入门",
    duration: "4 周",
    price: 399,
    originalPrice: 699,
    students: 4300,
    guarantee: true,
    emoji: "👨‍🏫",
  },
  {
    id: "creator-ai-writing",
    title: "自媒体 AI 创作涨粉课",
    persona: "自媒体",
    personaColor: "bg-pink-100 text-pink-700",
    difficulty: "入门",
    duration: "6 周",
    price: 499,
    originalPrice: 899,
    students: 3670,
    guarantee: true,
    emoji: "📱",
  },
  {
    id: "rag-agent-dev",
    title: "RAG + Agent 实战开发",
    persona: "程序员",
    personaColor: "bg-blue-100 text-blue-700",
    difficulty: "高级",
    duration: "8 周",
    price: 1299,
    originalPrice: 1999,
    students: 980,
    guarantee: false,
    emoji: "🤖",
  },
];

export function HotCourses() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">热门课程</h2>
            <p className="text-gray-500">精选高质量课程，对赌协议保障效果</p>
          </div>
          <Link
            href="/courses"
            className="hidden sm:flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 transition-colors"
          >
            查看全部课程 →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {HOT_COURSES.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group bg-white border border-gray-200 hover:border-orange-300 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              {/* 封面 */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl relative">
                {course.emoji}
                {course.guarantee && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    🤝 效果保障
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${course.personaColor}`}>
                    {course.persona}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {course.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">{course.duration}</span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {course.title}
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-orange-500">¥{course.price}</span>
                    <span className="text-sm text-gray-400 line-through ml-2">¥{course.originalPrice}</span>
                  </div>
                  <span className="text-xs text-gray-400">{course.students.toLocaleString()} 人已报名</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-orange-500 font-semibold border border-orange-200 px-6 py-3 rounded-full hover:bg-orange-50 transition-colors"
          >
            查看全部课程 →
          </Link>
        </div>
      </div>
    </section>
  );
}
