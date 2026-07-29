import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { COURSE_DETAILS, ALL_COURSES } from "@/lib/courseData";
import { CourseDetailSidebar } from "@/components/course/CourseDetailSidebar";
import { CourseCard } from "@/components/course/CourseCard";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return ALL_COURSES.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = COURSE_DETAILS[params.slug];
  if (!course) return {};
  return {
    title: course.title,
    description: course.targetAudience.join("；"),
  };
}

export default function CourseDetailPage({ params }: Props) {
  const course = COURSE_DETAILS[params.slug];
  if (!course) notFound();

  // 推荐同人群的其他课程
  const related = ALL_COURSES.filter(
    (c) => c.persona === course.persona && c.slug !== course.slug
  ).slice(0, 3);

  const appUrl =
    course.persona === "程序员"
      ? process.env.NEXT_PUBLIC_ENGINEER_APP_URL || "https://app.mniuai.com"
      : course.persona === "少儿"
      ? process.env.NEXT_PUBLIC_KIDS_APP_URL || "https://kids.mniuai.com"
      : course.persona === "大学生"
      ? process.env.NEXT_PUBLIC_CAMPUS_APP_URL || "https://campus.mniuai.com"
      : course.persona === "老师"
      ? process.env.NEXT_PUBLIC_EDU_APP_URL || "https://edu.mniuai.com"
      : process.env.NEXT_PUBLIC_PRO_APP_URL || "https://pro.mniuai.com";

  return (
    <div className="pt-16">
      {/* 顶部基本信息区 */}
      <section className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 左侧课程信息 */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${course.personaColor}`}
                >
                  {course.persona}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  {course.difficulty}
                </span>
                <span className="text-xs text-gray-500">{course.duration}</span>
                {course.guarantee && (
                  <span className="text-xs bg-orange-50 text-orange-600 font-medium px-2.5 py-1 rounded-full">
                    🤝 效果保障
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>

              <p className="text-gray-500 text-lg mb-6">
                {course.instructor.title}
              </p>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span>👥 {course.students.toLocaleString()} 人已报名</span>
                <span>📅 {course.duration}</span>
                <span>⭐ 4.9 分</span>
              </div>
            </div>

            {/* 右侧固定侧边栏 */}
            <div className="lg:col-span-1">
              <CourseDetailSidebar
                price={course.price}
                originalPrice={course.originalPrice}
                guarantee={course.guarantee}
                ctaUrl={`${appUrl}/register`}
                ctaText="立即报名"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左侧内容 */}
          <div className="lg:col-span-2 space-y-12">
            {/* 课程封面 */}
            <div
              className={`aspect-video bg-gradient-to-br ${course.coverGradient} rounded-2xl flex items-center justify-center text-8xl`}
            >
              {course.emoji}
            </div>

            {/* 适合人群 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">适合人群</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.targetAudience.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl p-3"
                  >
                    <span className="text-green-500 mt-0.5">✅</span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 你能学到什么 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">你能学到什么</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.learningOutcomes.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3"
                  >
                    <span className="text-blue-500 mt-0.5">🎯</span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 课程大纲 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">课程大纲</h2>
              <div className="space-y-4">
                {course.curriculum.map((module, i) => (
                  <div
                    key={i}
                    className="border border-gray-100 rounded-xl p-5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full">
                        {module.week}
                      </span>
                      <span className="font-semibold text-gray-900">{module.title}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {module.topics.map((topic, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* 讲师介绍 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">讲师介绍</h2>
              <div className="bg-gray-50 rounded-2xl p-6 flex items-start gap-4">
                <span className="text-5xl">{course.instructor.avatar}</span>
                <div>
                  <div className="font-bold text-gray-900 text-lg mb-1">
                    {course.instructor.name}
                  </div>
                  <div className="text-sm text-orange-500 font-medium mb-3">
                    {course.instructor.title}
                  </div>
                  <p className="text-sm text-gray-600">{course.instructor.bio}</p>
                </div>
              </div>
            </section>

            {/* 对赌协议 */}
            {course.guarantee && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">🤝 对赌协议保障</h2>
                <div className="bg-gray-900 text-white rounded-2xl p-6">
                  <p className="text-xl font-bold text-orange-400 mb-4">
                    {course.guaranteeDetail.condition}
                  </p>
                  <div className="text-sm text-gray-400 mb-3">学习门槛（需同时满足）：</div>
                  <ul className="space-y-2">
                    {course.guaranteeDetail.requirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">✅</span>
                        <span className="text-gray-300">{req}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/guarantee"
                    className="inline-block mt-4 text-orange-400 hover:text-orange-300 text-sm underline underline-offset-2"
                  >
                    查看完整退款条款 →
                  </Link>
                </div>
              </section>
            )}

            {/* 学员评价 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">学员评价</h2>
              <div className="space-y-4">
                {course.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white border border-gray-100 rounded-xl p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{review.avatar}</span>
                      <div>
                        <div className="font-medium text-gray-900">{review.name}</div>
                        <div className="text-xs text-gray-500">{review.role}</div>
                      </div>
                      <div className="ml-auto flex">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i} className="text-yellow-400">⭐</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.content}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 常见问题 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">常见问题</h2>
              <div className="space-y-3">
                {course.faqs.map((faq, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-2">Q：{faq.q}</h3>
                    <p className="text-sm text-gray-600">A：{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 右侧边栏占位（与顶部侧边栏呼应） */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <CourseDetailSidebar
                price={course.price}
                originalPrice={course.originalPrice}
                guarantee={course.guarantee}
                ctaUrl={`${appUrl}/register`}
                ctaText="立即报名"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 相关课程推荐 */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">相关课程推荐</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
