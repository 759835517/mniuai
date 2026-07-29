"use client";

import { useState } from "react";
import Link from "next/link";

const MOCK_LESSONS = [
  {
    id: 1,
    title: "《背影》第一课时",
    subject: "语文",
    grade: "初二",
    createdAt: "2026-07-25",
  },
  {
    id: 2,
    title: "一次函数图像与性质",
    subject: "数学",
    grade: "初二",
    createdAt: "2026-07-24",
  },
  {
    id: 3,
    title: "光合作用",
    subject: "生物",
    grade: "初一",
    createdAt: "2026-07-22",
  },
];

export default function MyLessonsPage() {
  const [lessons] = useState(MOCK_LESSONS);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLessons = lessons.filter((l) =>
    l.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">我的教案库</h1>
            <p className="text-sm text-gray-500">共 {lessons.length} 份教案</p>
          </div>
          <Link
            href="/tools/lesson"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-full transition-colors text-sm"
          >
            + 新建教案
          </Link>
        </div>

        {/* 搜索栏 */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="搜索教案标题..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>

        {/* 教案列表 */}
        {filteredLessons.length > 0 ? (
          <div className="space-y-3">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">📝</span>
                      <h3 className="font-semibold text-gray-900">
                        {lesson.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{lesson.subject}</span>
                      <span>·</span>
                      <span>{lesson.grade}</span>
                      <span>·</span>
                      <span>{lesson.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      编辑
                    </button>
                    <button className="text-sm text-orange-600 hover:text-orange-700 px-3 py-1.5 border border-orange-200 rounded-lg hover:border-orange-300 transition-colors">
                      导出
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <span className="text-5xl mb-4 block">📭</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              暂无教案
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "未找到匹配的教案" : "开始创建你的第一份AI教案"}
            </p>
            <Link
              href="/tools/lesson"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              + 新建教案
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
