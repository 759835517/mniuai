"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCourseStore } from "@/lib/stores/courseStore";
import Loading from "@/components/shared/Loading";

const CATEGORIES = [
  { value: "", label: "全部分类" },
  { value: "AI_BASICS", label: "AI 基础" },
  { value: "INTERVIEW", label: "面试" },
  { value: "COMPETITION", label: "竞赛" },
  { value: "FULLSTACK", label: "全栈" },
];

const DIFFICULTIES = [
  { value: "", label: "全部难度" },
  { value: "BEGINNER", label: "入门" },
  { value: "INTERMEDIATE", label: "进阶" },
  { value: "ADVANCED", label: "高级" },
];

export default function CoursesPage() {
  const { courses, loading, listCourses } = useCourseStore();
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    listCourses(category, difficulty);
  }, [category, difficulty, listCourses]);

  if (loading) return <Loading text="加载课程列表..." className="mt-12" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">课程中心</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded border border-[#30363D] bg-[#0D1117] px-3 py-2 text-sm text-[#F0F6FC]"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="rounded border border-[#30363D] bg-[#0D1117] px-3 py-2 text-sm text-[#F0F6FC]"
        >
          {DIFFICULTIES.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>

      {/* Course Grid */}
      {courses.length === 0 ? (
        <Card className="border-[#30363D] bg-[#161B22] p-12 text-center">
          <p className="text-[#8B949E]">暂无课程</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card className="cursor-pointer border-[#30363D] bg-[#161B22] transition-all hover:border-[#3B82F6]/30 hover:shadow-glow">
                <div className="aspect-video w-full overflow-hidden rounded-t bg-[#0D1117]">
                  {course.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.coverUrl} alt={course.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#8B949E]">暂无封面</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#F0F6FC]">{course.title}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded bg-[#3B82F6]/20 px-2 py-0.5 text-xs text-[#3B82F6]">{course.category}</span>
                    <span className="rounded bg-[#8B5CF6]/20 px-2 py-0.5 text-xs text-[#8B5CF6]">{course.difficulty}</span>
                  </div>
                  <p className="mt-2 text-xs text-[#8B949E]">{course.totalLessons} 章节 · {course.totalMinutes} 分钟</p>
                  {course.enrolled && (
                    <div className="mt-3">
                      <div className="h-1.5 w-full rounded bg-[#30363D]">
                        <div className="h-1.5 rounded bg-[#3B82F6]" style={{ width: `${course.progressPercent}%` }} />
                      </div>
                      <p className="mt-1 text-xs text-[#8B949E]">{Math.round(course.progressPercent)}% 已完成</p>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
