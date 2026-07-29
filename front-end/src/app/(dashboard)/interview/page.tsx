"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { interviewApi } from "@/lib/api/interview";
import type { InterviewSkillProfile, MockInterview } from "@/lib/types/interview";
import { Mic, BookOpen, History, TrendingUp, Target } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  JAVA: "Java",
  ALGORITHM: "算法",
  SYSTEM_DESIGN: "系统设计",
  AI: "AI/ML",
  DATABASE: "数据库",
  BEHAVIORAL: "行为面试",
};

function SkillBar({ category, score, count }: { category: string; score: number; count: number }) {
  const label = CATEGORY_LABELS[category] || category;
  const percentage = Math.min(100, (score / 10) * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#8B949E]">{label}</span>
        <span className="text-[#F0F6FC]">{score.toFixed(1)} / 10 ({count}次)</span>
      </div>
      <div className="h-2 w-full rounded bg-[#30363D]">
        <div className="h-2 rounded bg-[#3B82F6] transition-all" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export default function InterviewHomePage() {
  const [profile, setProfile] = useState<InterviewSkillProfile[]>([]);
  const [history, setHistory] = useState<MockInterview[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, historyRes] = await Promise.all([
        interviewApi.getSkillProfile(),
        interviewApi.listHistory(0, 5),
      ]);
      setProfile(profileRes);
      setHistory(historyRes.items);
    } catch {
      setProfile([]);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const avgScore = profile.length > 0
    ? profile.reduce((sum, p) => sum + p.avgScore, 0) / profile.length
    : 0;
  const totalInterviews = profile.reduce((sum, p) => sum + p.interviewCount, 0);

  if (loading) return <p className="text-[#8B949E]">加载中...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">面试训练营</h1>
        <Link href="/interview/mock/setup">
          <Button className="bg-[#3B82F6]">
            <Mic className="mr-2 h-4 w-4" />
            开始模拟面试
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-[#30363D] bg-[#161B22] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#3B82F6]/20 p-2">
              <Target className="h-5 w-5 text-[#3B82F6]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgScore.toFixed(1)}</p>
              <p className="text-xs text-[#8B949E]">平均分数</p>
            </div>
          </div>
        </Card>
        <Card className="border-[#30363D] bg-[#161B22] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-500/20 p-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalInterviews}</p>
              <p className="text-xs text-[#8B949E]">面试次数</p>
            </div>
          </div>
        </Card>
        <Card className="border-[#30363D] bg-[#161B22] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#8B5CF6]/20 p-2">
              <BookOpen className="h-5 w-5 text-[#8B5CF6]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{profile.length}</p>
              <p className="text-xs text-[#8B949E]">已练习分类</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Skill Profile */}
        <Card className="border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="h-5 w-5 text-[#3B82F6]" />
            能力画像
          </h2>
          {profile.length === 0 ? (
            <div className="space-y-3">
              {Object.keys(CATEGORY_LABELS).map((cat) => (
                <SkillBar key={cat} category={cat} score={0} count={0} />
              ))}
              <p className="mt-3 text-center text-sm text-[#8B949E]">暂无数据，开始面试后生成画像</p>
            </div>
          ) : (
            <div className="space-y-3">
              {profile.map((p) => (
                <SkillBar key={p.id} category={p.category} score={p.avgScore} count={p.interviewCount} />
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-4 text-lg font-semibold">快速开始</h2>
          <div className="space-y-3">
            <Link href="/interview/mock/setup" className="block">
              <div className="flex items-center gap-3 rounded-lg border border-[#30363D] p-4 transition hover:border-[#3B82F6]/50 hover:bg-[#30363D]/30">
                <Mic className="h-8 w-8 text-[#3B82F6]" />
                <div>
                  <p className="font-medium">模拟面试</p>
                  <p className="text-sm text-[#8B949E]">AI 面试官 1v1 模拟真实面试</p>
                </div>
              </div>
            </Link>
            <Link href="/interview/questions" className="block">
              <div className="flex items-center gap-3 rounded-lg border border-[#30363D] p-4 transition hover:border-[#3B82F6]/50 hover:bg-[#30363D]/30">
                <BookOpen className="h-8 w-8 text-green-400" />
                <div>
                  <p className="font-medium">题库练习</p>
                  <p className="text-sm text-[#8B949E]">浏览分类题库，针对性训练</p>
                </div>
              </div>
            </Link>
          </div>
        </Card>
      </div>

      {/* History */}
      <Card className="border-[#30363D] bg-[#161B22] p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <History className="h-5 w-5 text-[#8B949E]" />
          面试历史
        </h2>
        {history.length === 0 ? (
          <p className="text-center text-[#8B949E]">暂无面试记录</p>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <Link key={item.id} href={`/interview/mock/${item.id}/result`}>
                <div className="flex items-center justify-between rounded border border-[#30363D] p-3 transition hover:border-[#3B82F6]/50">
                  <div>
                    <p className="font-medium">{item.mode} 模式</p>
                    <p className="text-xs text-[#8B949E]">{new Date(item.startedAt).toLocaleDateString("zh-CN")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded px-2 py-0.5 text-xs ${
                      item.status === "COMPLETED" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {item.status === "COMPLETED" ? "已完成" : item.status}
                    </span>
                    {item.overallScore != null && (
                      <span className="text-lg font-bold text-[#3B82F6]">{item.overallScore}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
