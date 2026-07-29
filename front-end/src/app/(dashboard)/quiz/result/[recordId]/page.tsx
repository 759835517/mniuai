"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quizApi } from "@/lib/api/quiz";
import type { ExamRecord, AnswerDetail } from "@/lib/types/quiz";
import { Trophy, Target, CheckCircle, XCircle, MessageSquare, ChevronRight, Loader2 } from "lucide-react";

const levelLabels: Record<string, { label: string; color: string }> = {
  MASTERY: { label: "精通", color: "text-purple-400" },
  GOOD: { label: "良好", color: "text-green-400" },
  PASS: { label: "及格", color: "text-yellow-400" },
  FAIL: { label: "不及格", color: "text-red-400" },
};

export default function ExamResultPage() {
  const params = useParams();
  const router = useRouter();
  const recordId = params.recordId as string;

  const [record, setRecord] = useState<ExamRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    quizApi.getRecord(recordId)
      .then(setRecord)
      .catch(() => {
        alert("加载结果失败");
        router.push("/quiz");
      })
      .finally(() => setLoading(false));
  }, [recordId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  if (!record) {
    return <p className="text-center text-[#8B949E]">记录不存在</p>;
  }

  const levelInfo = levelLabels[record.passed ? "GOOD" : "FAIL"];
  const correctRate = record.totalQuestions > 0
    ? Math.round((record.correctCount / record.totalQuestions) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Trophy className="h-6 w-6 text-yellow-400" />
        <h1 className="text-2xl font-bold">考试结果</h1>
      </div>

      {/* Score Overview */}
      <Card className="border-[#30363D] bg-[#161B22] p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className={`text-4xl font-bold ${record.passed ? "text-green-400" : "text-red-400"}`}>
              {record.score}
            </p>
            <p className="text-sm text-[#8B949E]">总分</p>
            <span className={`mt-1 inline-block text-xs ${levelInfo.color}`}>
              {record.passed ? "通过" : "未通过"}
            </span>
          </div>
          <div>
            <p className="text-4xl font-bold text-[#3B82F6]">{record.correctCount}</p>
            <p className="text-sm text-[#8B949E]">答对题数</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-purple-400">{correctRate}%</p>
            <p className="text-sm text-[#8B949E]">正确率</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-yellow-400">{record.totalQuestions - record.correctCount}</p>
            <p className="text-sm text-[#8B949E]">答错题数</p>
          </div>
        </div>
      </Card>

      {/* AI Evaluation */}
      {record.aiEvaluation && record.aiEvaluation.thinkingQuestions.length > 0 && (
        <Card className="border-[#30363D] bg-[#161B22] p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-[#3B82F6]" />
            <h2 className="text-lg font-semibold">AI 思考题评分</h2>
          </div>
          {record.aiEvaluation.overallComment && (
            <p className="mb-4 text-sm text-[#8B949E]">{record.aiEvaluation.overallComment}</p>
          )}
          <div className="space-y-4">
            {record.aiEvaluation.thinkingQuestions.map((evalItem) => {
              const answer = record.answers.find((a) => a.questionId === evalItem.questionId);
              return (
                <div key={evalItem.questionId} className="rounded-lg bg-[#0D1117] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">思考题</span>
                    <span className="text-sm font-mono text-[#3B82F6]">
                      {evalItem.score} / {evalItem.maxScore}
                    </span>
                  </div>
                  {answer && (
                    <p className="mb-2 text-xs text-[#8B949E] line-clamp-2">
                      你的回答：{String(answer.userAnswer)}
                    </p>
                  )}
                  <p className="text-sm text-[#E6EDF3]">{evalItem.feedback}</p>
                  {evalItem.dimensionScores && Object.keys(evalItem.dimensionScores).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(evalItem.dimensionScores).map(([dim, score]) => (
                        <span key={dim} className="rounded bg-[#30363D] px-2 py-0.5 text-xs text-[#8B949E]">
                          {dim}: {score}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Answer Review */}
      <Card className="border-[#30363D] bg-[#161B22] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-[#3B82F6]" />
          <h2 className="text-lg font-semibold">答题回顾</h2>
        </div>
        <div className="space-y-2">
          {record.answers.map((answer, idx) => (
            <div key={answer.questionId} className="flex items-center justify-between rounded-lg bg-[#0D1117] p-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#8B949E]">第 {idx + 1} 题</span>
                <span className={`rounded px-2 py-0.5 text-xs ${
                  answer.questionType === "SINGLE_CHOICE" ? "bg-blue-500/20 text-blue-400" :
                  answer.questionType === "MULTI_CHOICE" ? "bg-purple-500/20 text-purple-400" :
                  "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {answer.questionType === "SINGLE_CHOICE" ? "单选" :
                   answer.questionType === "MULTI_CHOICE" ? "多选" : "思考"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {answer.isCorrect === true && <CheckCircle className="h-4 w-4 text-green-400" />}
                {answer.isCorrect === false && <XCircle className="h-4 w-4 text-red-400" />}
                {answer.isCorrect === null && (
                  <span className="text-xs text-[#8B949E]">AI 评分</span>
                )}
                <span className="text-sm font-mono text-[#3B82F6]">+{answer.pointsEarned} XP</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => router.push("/quiz")}>
          返回测验列表
        </Button>
        <Button className="bg-[#3B82F6]" onClick={() => router.push("/quiz/records")}>
          查看历史记录
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
