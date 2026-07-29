import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { campusApi } from "@/lib/api";

interface CourseSummary {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  duration: number;
  sortOrder: number;
}

interface PathDetail {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  level: string;
  duration: string;
  salaryRange: string;
  studentCount: number;
  tags: string[];
  courses: CourseSummary[];
  enrolled: boolean;
  progressPct: number;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return { title: `学习路径详情` };
}

async function getPathDetail(slug: string): Promise<PathDetail | null> {
  try {
    const data = await campusApi.getPathDetail(slug);
    return data;
  } catch (err) {
    console.error("获取路径详情失败:", err);
    return null;
  }
}

export default async function PathDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const path = await getPathDetail(params.slug);

  if (!path) {
    notFound();
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 mb-6 border border-gray-100">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-5xl">{path.icon || "📚"}</span>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{path.name}</h1>
              <p className="text-gray-500 mb-4">{path.description}</p>
              {path.tags && path.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {path.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-green-600">
                {path.salaryRange || "¥10K~18K"}
              </div>
              <div className="text-xs text-gray-400">平均起薪</div>
            </div>
          </div>

          {path.enrolled && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-700">学习进度</span>
                <span className="text-sm font-bold text-blue-700">{Math.round(path.progressPct || 0)}%</span>
              </div>
              <div className="bg-blue-100 rounded-full h-2">
                <div
                  className="bg-blue-500 rounded-full h-2 transition-all"
                  style={{ width: `${Math.round(path.progressPct || 0)}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-100 pt-6">
            <div>
              <div className="text-lg font-bold text-gray-900">{path.duration || "12周"}</div>
              <div className="text-xs text-gray-400">学习周期</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {path.courses?.length || 0}门
              </div>
              <div className="text-xs text-gray-400">课程内容</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {path.studentCount ? `${path.studentCount}+` : "1000+"}
              </div>
              <div className="text-xs text-gray-400">在学学员</div>
            </div>
          </div>
        </div>

        {/* 课程列表 */}
        {path.courses && path.courses.length > 0 && (
          <div className="bg-white rounded-2xl p-8 mb-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">课程大纲</h2>
            <div className="space-y-4">
              {path.courses.map((course, i) => (
                <div key={course.id} className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                    {i + 1}
                  </div>
                  <div className="flex-1 border-l-2 border-blue-100 pl-4">
                    <div className="font-semibold text-gray-900 mb-1">{course.title}</div>
                    <div className="text-sm text-gray-500 mb-2">{course.description}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>📹 {course.lessonCount || 0} 课时</span>
                      <span>⏱ {course.duration || 0} 分钟</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-4">
          {path.enrolled ? (
            <Link
              href="/my/progress"
              className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-4 rounded-xl transition-colors"
            >
              继续学习 →
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-4 rounded-xl transition-colors"
            >
              免费开始学习 →
            </Link>
          )}
          <Link
            href="/pricing"
            className="flex-1 text-center border-2 border-blue-300 text-blue-600 font-semibold px-6 py-4 rounded-xl hover:bg-blue-50 transition-colors"
          >
            查看就业保障方案
          </Link>
        </div>
      </div>
    </div>
  );
}
