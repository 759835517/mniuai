import Link from "next/link";
import type { Metadata } from "next";
import { campusApi } from "@/lib/api";

export const metadata: Metadata = {
  title: "学习路径",
  description: "4条经过验证的就业路径，70%学员6个月内成功就业",
};

interface LearningPath {
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
}

async function getPaths(): Promise<LearningPath[]> {
  try {
    const data = await campusApi.listPaths();
    return data || [];
  } catch (err) {
    console.error("获取学习路径失败:", err);
    return [];
  }
}

export default async function PathsPage() {
  const paths = await getPaths();

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">选择你的学习路径</h1>
          <p className="text-gray-500">4条经过验证的就业路径，70%学员6个月内成功就业</p>
        </div>

        {paths.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-4">📚</div>
            <p>暂无学习路径，请联系管理员配置</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {paths.map((path) => (
              <Link
                key={path.id}
                href={`/paths/${path.slug}`}
                className="bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{path.icon || "📚"}</span>
                  <div className="flex flex-col items-end gap-1">
                    {path.slug === "fullstack" && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-500 text-white">
                        最热门
                      </span>
                    )}
                    <span className="text-sm font-semibold text-green-600">
                      {path.salaryRange || "¥10K~18K"}
                    </span>
                  </div>
                </div>
                <h2 className="font-bold text-gray-900 text-xl mb-2">{path.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{path.description}</p>
                {path.tags && path.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
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
                <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
                  <div>
                    <div className="font-bold text-gray-700 text-sm">{path.duration || "12周"}</div>
                    <div>学习周期</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-700 text-sm">{path.level || "L0→L4"}</div>
                    <div>难度等级</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-700 text-sm">
                      {path.studentCount ? `${path.studentCount}+` : "1000+"}
                    </div>
                    <div>在学学员</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
