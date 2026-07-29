"use client";

import { useState, useMemo, useEffect } from "react";
import { CourseFilter } from "@/components/course/CourseFilter";
import { CourseCard } from "@/components/course/CourseCard";
import { getPublicCourses, type PublicCourse } from "@/lib/api";

const PERSONAS = ["全部", "程序员", "少儿", "大学生", "老师", "自媒体", "小老板"];
const DIFFICULTIES = ["全部", "入门", "进阶", "高级"];

// 人群分类映射（后端 category 字段）
const PERSONA_CATEGORY_MAP: Record<string, string> = {
  程序员: "engineer",
  少儿: "kids",
  大学生: "campus",
  老师: "teacher",
  自媒体: "creator",
  小老板: "business",
};

// 静态课程数据（后端无数据时展示）
const FALLBACK_COURSES: PublicCourse[] = [
  { id: "1", title: "AI 工程师面试训练营", description: "从传统开发到 AI 工程师的系统学习路径", coverUrl: "", category: "engineer", difficulty: "进阶", targetAudience: "有 1 年以上编程经验的工程师", totalLessons: 48, totalMinutes: 2880 },
  { id: "2", title: "少儿 AI 编程竞赛班", description: "专业教研团队设计，覆盖 NOI / 信息学竞赛全路径", coverUrl: "", category: "kids", difficulty: "入门", targetAudience: "6-16 岁对编程感兴趣的孩子", totalLessons: 64, totalMinutes: 3840 },
  { id: "3", title: "大学生零基础就业班", description: "零基础系统学习 AI 应用开发，保障就业", coverUrl: "", category: "campus", difficulty: "入门", targetAudience: "在校大学生，希望毕业即就业", totalLessons: 96, totalMinutes: 5760 },
  { id: "4", title: "教师 AI 备课效率课", description: "专为教师设计，快速上手 AI 备课、出题、批改全流程", coverUrl: "", category: "teacher", difficulty: "入门", targetAudience: "中小学各学科任课教师", totalLessons: 16, totalMinutes: 960 },
  { id: "5", title: "自媒体 AI 创作涨粉课", description: "公众号/小红书/视频号运营者专属，用 AI 降低创作成本", coverUrl: "", category: "creator", difficulty: "入门", targetAudience: "自媒体运营者", totalLessons: 24, totalMinutes: 1440 },
  { id: "6", title: "RAG + Agent 实战开发", description: "深入 RAG 和 Agent 技术栈，企业级 AI 应用开发", coverUrl: "", category: "engineer", difficulty: "高级", targetAudience: "有 Python 基础，希望深入 AI 应用开发", totalLessons: 32, totalMinutes: 1920 },
  { id: "7", title: "小老板 AI 获客引流课", description: "实体店/服务业小老板专属，用 AI 做朋友圈文案、引流内容", coverUrl: "", category: "business", difficulty: "入门", targetAudience: "餐饮、美业、零售等本地生活门店老板", totalLessons: 16, totalMinutes: 960 },
  { id: "8", title: "AI 全栈实战项目营", description: "全栈开发 + AI 应用，完成 3 个企业级项目", coverUrl: "", category: "engineer", difficulty: "进阶", targetAudience: "希望提升全栈 + AI 能力的开发者", totalLessons: 40, totalMinutes: 2400 },
];

export default function CoursesPage() {
  const [selectedPersona, setSelectedPersona] = useState("全部");
  const [selectedDifficulty, setSelectedDifficulty] = useState("全部");
  const [courses, setCourses] = useState<PublicCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  // 从后端加载课程
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPublicCourses({ page: 0, size: 50 });
      if (res.items && res.items.length > 0) {
        setCourses(res.items);
        setUseFallback(false);
      } else {
        // 后端无数据，使用静态数据
        setCourses(FALLBACK_COURSES);
        setUseFallback(true);
      }
    } catch (err) {
      // 后端不可用，使用静态数据
      setCourses(FALLBACK_COURSES);
      setUseFallback(true);
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchPersona =
        selectedPersona === "全部" ||
        PERSONA_CATEGORY_MAP[selectedPersona] === course.category ||
        course.category === selectedPersona;
      const matchDifficulty =
        selectedDifficulty === "全部" || course.difficulty === selectedDifficulty;
      return matchPersona && matchDifficulty;
    });
  }, [courses, selectedPersona, selectedDifficulty]);

  return (
    <div className="pt-16">
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">课程广场</h1>
          <p className="text-gray-500 mb-6">精选课程，对赌协议保障学习效果</p>

          <CourseFilter
            personas={PERSONAS}
            difficulties={DIFFICULTIES}
            selectedPersona={selectedPersona}
            selectedDifficulty={selectedDifficulty}
            onPersonaChange={setSelectedPersona}
            onDifficultyChange={setSelectedDifficulty}
          />

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {loading ? "加载中..." : `共 ${filteredCourses.length} 门课程`}
            </div>
            {useFallback && (
              <div className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                展示静态数据（后端未连接）
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-t-2xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={{
                    slug: course.id,
                    title: course.title,
                    persona: getPersonaLabel(course.category),
                    personaColor: getPersonaColor(course.category),
                    difficulty: course.difficulty,
                    duration: `${Math.round(course.totalMinutes / 60)} 小时`,
                    price: 0,
                    originalPrice: 0,
                    students: 0,
                    guarantee: true,
                    emoji: getPersonaEmoji(course.category),
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="text-5xl mb-4 block">🔍</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">没有找到匹配的课程</h3>
              <p className="text-gray-500">请尝试调整筛选条件</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// 辅助函数：根据 category 获取人群标签
function getPersonaLabel(category: string): string {
  const map: Record<string, string> = {
    engineer: "程序员",
    kids: "少儿",
    campus: "大学生",
    teacher: "老师",
    creator: "自媒体",
    business: "小老板",
  };
  return map[category] || category;
}

function getPersonaColor(category: string): string {
  const map: Record<string, string> = {
    engineer: "bg-blue-100 text-blue-700",
    kids: "bg-green-100 text-green-700",
    campus: "bg-purple-100 text-purple-700",
    teacher: "bg-yellow-100 text-yellow-700",
    creator: "bg-pink-100 text-pink-700",
    business: "bg-orange-100 text-orange-700",
  };
  return map[category] || "bg-gray-100 text-gray-700";
}

function getPersonaEmoji(category: string): string {
  const map: Record<string, string> = {
    engineer: "👨‍💻",
    kids: "👶",
    campus: "🎓",
    teacher: "👨‍🏫",
    creator: "📱",
    business: "🏪",
  };
  return map[category] || "📚";
}
