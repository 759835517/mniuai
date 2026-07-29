"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quizApi } from "@/lib/api/quiz";
import { roadmapApi } from "@/lib/api/roadmap";
import type { Exam, MasterySummary, WeekMastery } from "@/lib/types/quiz";
import type { LearningRoadmap } from "@/lib/types/roadmap";
import { ClipboardCheck, Trophy, Target, ChevronRight, Loader2, PlusCircle } from "lucide-react";

const levelLabels: Record<string, { label: string; color: string }> = {
  MASTERY: { label: "精通", color: "bg-purple-500/20 text-purple-400" },
  GOOD: { label: "良好", color: "bg-green-500/20 text-green-400" },
  PASS: { label: "及格", color: "bg-yellow-500/20 text-yellow-400" },
  FAIL: { label: "不及格", color: "bg-red-500/20 text-red-400" },
  NOT_TESTED: { label: "未测试", color: "bg-[#30363D] text-[#8B949E]" },
};

function WeekMasteryBadge({ week }: { week: WeekMastery }) {
  const info = levelLabels[week.level] ?? levelLabels.NOT_TESTED ?? { label: "未知", color: "bg-[#30363D] text-[#8B949E]" };
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${info.color}`}>
        {info.label}
      </span>
      <span className="text-xs text-[#8B949E]">第 {week.week} 周</span>
      {week.score !== null && (
        <span className="text-xs font-mono text-[#E6EDF3]">{week.score}分</span>
      )}
    </div>
  );
}

export default function QuizPage() {
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [mastery, setMastery] = useState<MasterySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  // Load exams for a given roadmap id
  const loadExamsForRoadmap = useCallback((roadmapId: string) => {
    return Promise.all([
      quizApi.listByRoadmap(roadmapId),
      quizApi.getMastery(roadmapId),
    ]).then(([examsRes, masteryRes]) => {
      setExams(examsRes);
      setMastery(masteryRes);
    });
  }, []);

  // Create a demo roadmap + exams via backend init-demo endpoint
  const createDemoRoadmap = useCallback(async () => {
    setCreating(true);
    try {
      // Backend creates demo roadmap + exams in one shot (no AI dependency)
      const { roadmapId } = await quizApi.initDemo();
      // Fetch the active roadmap to display
      const active = await roadmapApi.getActive();
      setRoadmap(active);
      await loadExamsForRoadmap(roadmapId);
    } catch (e) {
      setError((e as Error).message || "创建演示数据失败");
    } finally {
      setCreating(false);
    }
  }, [loadExamsForRoadmap]);

  useEffect(() => {
    // First fetch the user's active roadmap, then load exams for it
    roadmapApi.getActive()
      .then((activeRoadmap) => {
        if (!activeRoadmap) {
          setRoadmap(null);
          setLoading(false);
          return;
        }
        setRoadmap(activeRoadmap);
        return loadExamsForRoadmap(activeRoadmap.id);
      })
      .catch((e) => {
        setExams([]);
        setMastery(null);
        setError(e?.message || "加载失败");
      })
      .finally(() => setLoading(false));
  }, [loadExamsForRoadmap]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  // No roadmap: offer to create a demo one automatically
  if (!roadmap) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="h-6 w-6 text-[#3B82F6]" />
          <h1 className="text-2xl font-bold">测验考试</h1>
        </div>
        <Card className="border-[#30363D] bg-[#161B22] p-8 text-center">
          <p className="text-[#8B949E] mb-4">您还没有学习路线图</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="bg-[#3B82F6]"
              onClick={createDemoRoadmap}
              disabled={creating}
            >
              {creating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}
              {creating ? "创建中..." : "生成演示路线图"}
            </Button>
            <Link href="/roadmap">
              <Button variant="outline">
                自定义路线图
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const overallInfo = mastery ? (levelLabels[mastery.overallLevel] ?? null) : null;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-6 w-6 text-[#3B82F6]" />
        <h1 className="text-2xl font-bold">测验考试</h1>
      </div>

      {/* Mastery Overview */}
      {mastery && (
        <Card className="border-[#30363D] bg-[#161B22] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <h2 className="text-lg font-semibold">掌握程度总览</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg bg-[#0D1117] p-4 text-center">
              <p className="text-3xl font-bold text-[#3B82F6]">{mastery.overallScore}</p>
              <p className="text-sm text-[#8B949E]">综合得分</p>
              {overallInfo != null && (
                <span className={`mt-2 inline-block rounded px-2 py-0.5 text-xs ${overallInfo.color}`}>
                  {overallInfo.label}
                </span>
              )}
            </div>
            <div className="rounded-lg bg-[#0D1117] p-4 text-center">
              <p className="text-3xl font-bold text-green-400">{mastery.testedWeeks}</p>
              <p className="text-sm text-[#8B949E]">已测周数 / {mastery.totalWeeks}</p>
            </div>
            <div className="rounded-lg bg-[#0D1117] p-4 text-center">
              <p className="text-3xl font-bold text-purple-400">{mastery.weekMastery.filter((w) => w.level === "MASTERY").length}</p>
              <p className="text-sm text-[#8B949E]">精通周数</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {mastery.weekMastery.map((week) => (
              <WeekMasteryBadge key={week.week} week={week} />
            ))}
          </div>
        </Card>
      )}

      {/* Exam List */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-[#3B82F6]" />
          <h2 className="text-lg font-semibold">测验列表</h2>
        </div>
        {exams.length === 0 ? (
          <Card className="border-[#30363D] bg-[#161B22] p-8 text-center">
            <p className="text-[#8B949E]">暂无测验，请联系管理员生成</p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {exams.map((exam) => {
              const weekInfo = mastery?.weekMastery.find((w) => w.week === exam.week);
              const info = weekInfo ? (levelLabels[weekInfo.level] ?? null) : null;
              return (
                <Card key={exam.id} className="border-[#30363D] bg-[#161B22] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{exam.title}</h3>
                        {info && (
                          <span className={`rounded px-2 py-0.5 text-xs ${info.color}`}>
                            {info.label}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#8B949E]">{exam.description}</p>
                      <div className="mt-2 flex gap-4 text-xs text-[#8B949E]">
                        <span>{exam.questionCount} 题</span>
                        <span>限时 {exam.timeLimitMinutes} 分钟</span>
                        <span>及格 {exam.passingScore} 分</span>
                        {weekInfo && weekInfo.attempts > 0 && (
                          <span>已考 {weekInfo.attempts} 次</span>
                        )}
                      </div>
                    </div>
                    <Button
                      className="bg-[#3B82F6]"
                      onClick={() => router.push(`/quiz/exam/${exam.id}`)}
                    >
                      开始考试
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* History Link */}
      <div className="flex justify-center">
        <Link href="/quiz/records">
          <Button variant="outline">
            查看考试记录
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
