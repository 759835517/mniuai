"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCourseStore } from "@/lib/stores/courseStore";
import { toast } from "sonner";
import Loading from "@/components/shared/Loading";
import { Lock, Play, CheckCircle } from "lucide-react";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { currentCourse, loading, fetchCourse, enroll } = useCourseStore();

  useEffect(() => {
    fetchCourse(id);
  }, [id, fetchCourse]);

  const handleEnroll = async () => {
    try {
      await enroll(id);
      toast.success("报名成功");
    } catch {
      toast.error("报名失败");
    }
  };

  if (loading) return <Loading text="加载课程详情..." className="mt-12" />;
  if (!currentCourse) return <p className="text-[#8B949E]">课程不存在</p>;

  return (
    <div className="space-y-6">
      <button onClick={() => window.history.back()} className="text-sm text-[#8B949E] hover:text-[#F0F6FC]">
        ← 返回课程列表
      </button>

      {/* Course Header */}
      <Card className="border-[#30363D] bg-[#161B22] p-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="aspect-video w-full overflow-hidden rounded bg-[#0D1117] md:w-1/3">
            {currentCourse.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentCourse.coverUrl} alt={currentCourse.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-[#8B949E]">暂无封面</div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{currentCourse.title}</h1>
            <div className="mt-2 flex gap-2">
              <span className="rounded bg-[#3B82F6]/20 px-2 py-0.5 text-xs text-[#3B82F6]">{currentCourse.category}</span>
              <span className="rounded bg-[#8B5CF6]/20 px-2 py-0.5 text-xs text-[#8B5CF6]">{currentCourse.difficulty}</span>
            </div>
            <p className="mt-3 text-sm text-[#8B949E]">{currentCourse.description}</p>
            <div className="mt-4 flex gap-4 text-sm text-[#8B949E]">
              <span>{currentCourse.totalLessons} 章节</span>
              <span>{currentCourse.totalMinutes} 分钟</span>
            </div>
            {!currentCourse.enrolled ? (
              <Button onClick={handleEnroll} className="mt-4 bg-[#3B82F6]">
                立即报名
              </Button>
            ) : (
              <p className="mt-4 text-sm text-green-400">已报名</p>
            )}
          </div>
        </div>
      </Card>

      {/* Lesson List */}
      <Card className="border-[#30363D] bg-[#161B22] p-6">
        <h2 className="mb-4 text-lg font-semibold">章节列表</h2>
        <div className="space-y-2">
          {currentCourse.lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              className={`flex items-center justify-between rounded border border-[#30363D] p-3 ${
                lesson.unlocked ? "hover:border-[#3B82F6]/30" : "opacity-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#30363D] text-sm">
                  {idx + 1}
                </span>
                <div>
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-xs text-[#8B949E]">
                    {Math.floor(lesson.durationSec / 60)} 分 {lesson.durationSec % 60} 秒
                    {lesson.free && " · 免费试看"}
                  </p>
                </div>
              </div>
              <div>
                {lesson.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : lesson.unlocked ? (
                  <Link href={`/courses/${id}/lessons/${lesson.id}`}>
                    <Play className="h-5 w-5 text-[#3B82F6]" />
                  </Link>
                ) : (
                  <Lock className="h-5 w-5 text-[#8B949E]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
