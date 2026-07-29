"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { courseApi } from "@/lib/api/course";
import type { CourseSummary, Lesson } from "@/lib/types/course";

export default function AdminLessonsPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      courseApi.adminGet(courseId),
      courseApi.adminListLessons(courseId),
    ])
      .then(([c, ls]) => {
        setCourse(c as CourseSummary);
        setLessons(ls);
      })
      .catch(() => {
        setCourse(null);
        setLessons([]);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <p className="text-[#8B949E]">加载中...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/courses">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">章节管理</h1>
          {course && <p className="text-sm text-[#8B949E]">课程：{course.title}</p>}
        </div>
        <Button className="bg-[#3B82F6]">
          <Plus className="mr-2 h-4 w-4" />
          新建章节
        </Button>
      </div>

      <Card className="border-[#30363D] bg-[#161B22] p-6">
        {lessons.length === 0 ? (
          <p className="text-center text-[#8B949E]">暂无章节，点击右上角新建</p>
        ) : (
          <div className="space-y-2">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between rounded border border-[#30363D] p-3">
                <div>
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-xs text-[#8B949E]">
                    第 {lesson.sortOrder} 讲 · {Math.floor(lesson.videoDuration / 60)} 分钟 · {lesson.free ? "免费" : "付费"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
