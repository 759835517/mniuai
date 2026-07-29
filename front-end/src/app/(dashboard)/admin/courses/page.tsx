"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AdminCourse {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  status: string;
  totalLessons: number;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 接入 admin API
    setLoading(false);
  }, []);

  if (loading) return <p className="text-[#8B949E]">加载中...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">课程管理</h1>
        <Button className="bg-[#3B82F6]">
          <Plus className="mr-2 h-4 w-4" />
          新建课程
        </Button>
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
                <span className={`rounded px-2 py-0.5 text-xs ${
                  course.status === "PUBLISHED" ? "bg-green-500/20 text-green-400" : "bg-[#30363D] text-[#8B949E]"
                }`}>
                  {course.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
