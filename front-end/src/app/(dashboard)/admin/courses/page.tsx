"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { courseApi } from "@/lib/api/course";
import type { CourseSummary } from "@/lib/types/course";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseApi.adminList()
      .then((res) => setCourses(res.items))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-[#8B949E]">加载中...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">课程管理</h1>
        <Link href="/admin/courses/new">
          <Button className="bg-[#3B82F6]">
            <Plus className="mr-2 h-4 w-4" />
            新建课程
          </Button>
        </Link>
      </div>

      <Card className="border-[#30363D] bg-[#161B22] p-6">
        {courses.length === 0 ? (
          <p className="text-center text-[#8B949E]">暂无课程，点击右上角新建</p>
        ) : (
          <div className="space-y-2">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between rounded border border-[#30363D] p-3">
                <div>
                  <p className="font-medium">{course.title}</p>
                  <p className="text-xs text-[#8B949E]">{course.category} · {course.difficulty} · {course.totalLessons} 章节</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/courses/${course.id}/lessons`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
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
