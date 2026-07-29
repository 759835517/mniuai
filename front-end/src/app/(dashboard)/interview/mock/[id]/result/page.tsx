"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { interviewApi } from "@/lib/api/interview";
import type { MockInterview } from "@/lib/types/interview";
import { Trophy, Clock, ArrowLeft, Target, MessageSquare } from "lucide-react";

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "优秀";
  if (score >= 60) return "良好";
  if (score >= 40) return "及格";
  return "需加强";
}

export default function MockResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [interview, setInterview] = useState<MockInterview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewApi.getMock(id)
      .then(setInterview)
      .catch(() => setInterview(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-[#8B949E]">加载中...</p>;
  if (!interview) return <p className="text-[#8B949E]">面试记录不存在</p>;

  const score = interview.overallScore ?? 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button onClick={() => router.push("/interview")} className="flex items-center gap-2 text-[#8B949E] hover:text-[#F0F6FC]">
        <ArrowLeft className="h-4 w-4" />
        返回面试训练营
      </button>

      {/* Overall Score */}
      <Card className="border-[#30363D] bg-[#161B22] p-8 text-center">
        <Trophy className="mx-auto mb-4 h-12 w-12 text-[#3B82F6]" />
        <h1 className="mb-2 text-2xl font-bold">面试完成</h1>
        <div className={`text-6xl font-bold ${getScoreColor(score)}`}>{score}</div>
        <p className={`mt-2 text-lg ${getScoreColor(score)}`}>{getScoreLabel(score)}</p>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-[#8B949E]">
          <span className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            {interview.mode} 模式
          </span>
          {interview.durationSeconds && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {Math.floor(interview.durationSeconds / 60)} 分钟
            </span>
          )}
        </div>
      </Card>

      {/* AI Summary */}
      {interview.aiSummary && (
        <Card className="border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <MessageSquare className="h-5 w-5 text-[#3B82F6]" />
            AI 整体评价
          </h2>
          <p className="leading-relaxed text-[#E6EDF3]">{interview.aiSummary}</p>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-[#30363D] bg-[#161B22] p-4 text-center">
          <p className="text-3xl font-bold text-[#3B82F6]">{interview.mode}</p>
          <p className="text-xs text-[#8B949E]">面试模式</p>
        </Card>
        <Card className="border-[#30363D] bg-[#161B22] p-4 text-center">
          <p className="text-3xl font-bold text-green-400">
            {interview.completedAt ? new Date(interview.completedAt).toLocaleDateString("zh-CN") : "-"}
          </p>
          <p className="text-xs text-[#8B949E]">完成日期</p>
        </Card>
        <Card className="border-[#30363D] bg-[#161B22] p-4 text-center">
          <p className="text-3xl font-bold text-[#8B5CF6]">
            {interview.durationSeconds ? `${Math.floor(interview.durationSeconds / 60)}m` : "-"}
          </p>
          <p className="text-xs text-[#8B949E]">用时</p>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => router.push("/interview/mock/setup")}>
          再来一次
        </Button>
        <Button className="bg-[#3B82F6]" onClick={() => router.push("/interview")}>
          返回首页
        </Button>
      </div>
    </div>
  );
}
