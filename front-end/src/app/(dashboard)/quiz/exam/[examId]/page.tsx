"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { quizApi } from "@/lib/api/quiz";
import type { Exam, ExamQuestion, ExamRecord, AnswerItem } from "@/lib/types/quiz";
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle, Loader2 } from "lucide-react";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [record, setRecord] = useState<ExamRecord | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, unknown>>(new Map());
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load exam and start
  useEffect(() => {
    quizApi.getExam(examId)
      .then((examRes) => {
        setExam(examRes);
        return quizApi.getQuestions(examId);
      })
      .then((qRes) => {
        setQuestions(qRes);
        return quizApi.startExam(examId);
      })
      .then((recRes) => {
        setRecord(recRes);
      })
      .catch(() => {
        alert("加载考试失败");
        router.push("/quiz");
      })
      .finally(() => setLoading(false));
  }, [examId, router]);

  // Countdown timer
  useEffect(() => {
    if (!record || !exam) return;
    timerRef.current = setInterval(() => {
      setElapsed((e) => {
        const newElapsed = e + 1;
        const limit = exam.timeLimitMinutes * 60;
        if (newElapsed >= limit) {
          // Auto-submit when time is up
          handleSubmit();
        }
        return newElapsed;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [record, exam]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex >= questions.length - 1;
  const isFirstQuestion = currentIndex === 0;

  const handleSelectOption = (questionId: string, key: string, multi: boolean) => {
    setAnswers((prev) => {
      const newMap = new Map(prev);
      if (multi) {
        const current = (newMap.get(questionId) as string[]) || [];
        if (current.includes(key)) {
          newMap.set(questionId, current.filter((k) => k !== key));
        } else {
          newMap.set(questionId, [...current, key]);
        }
      } else {
        newMap.set(questionId, key);
      }
      return newMap;
    });
  };

  const handleThinkingAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const newMap = new Map(prev);
      newMap.set(questionId, value);
      return newMap;
    });
  };

  const handleSubmit = useCallback(async () => {
    if (!record || submitting) return;
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const answerList: AnswerItem[] = questions.map((q) => ({
      questionId: q.id,
      userAnswer: answers.get(q.id.toString()) ?? null,
    }));

    try {
      const result = await quizApi.submitExam(examId, {
        recordId: record.id,
        answers: answerList,
      });
      router.push(`/quiz/result/${result.id}`);
    } catch {
      alert("提交失败，请重试");
      setSubmitting(false);
    }
  }, [record, submitting, questions, answers, examId, router]);

  const handleForceSubmit = () => {
    setShowConfirm(false);
    handleSubmit();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  if (!exam || !currentQuestion) {
    return <p className="text-center text-[#8B949E]">考试不存在</p>;
  }

  const timeRemaining = Math.max(0, exam.timeLimitMinutes * 60 - elapsed);
  const isTimeLow = timeRemaining < 60;
  const answeredCount = answers.size;
  const totalQuestions = questions.length;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{exam.title}</h1>
        <div className={`flex items-center gap-2 font-mono text-lg ${isTimeLow ? "text-red-400" : "text-[#8B949E]"}`}>
          <Clock className="h-5 w-5" />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#8B949E]">
          已答 {answeredCount} / {totalQuestions}
        </span>
        <div className="flex-1 h-2 rounded-full bg-[#30363D]">
          <div
            className="h-2 rounded-full bg-[#3B82F6] transition-all"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Navigation Dots */}
      <div className="flex flex-wrap gap-2">
        {questions.map((q, idx) => {
          const isAnswered = answers.has(q.id.toString());
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-8 w-8 rounded text-xs font-medium transition-colors ${
                isCurrent ? "bg-[#3B82F6] text-white" :
                isAnswered ? "bg-green-600/30 text-green-400 border border-green-600" :
                "bg-[#30363D] text-[#8B949E] hover:bg-[#3B82F6]/30"
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <Card className="border-[#30363D] bg-[#161B22] p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded bg-[#3B82F6]/20 px-2 py-0.5 text-xs text-[#3B82F6]">
            第 {currentIndex + 1} 题
          </span>
          <span className="rounded bg-[#30363D] px-2 py-0.5 text-xs text-[#8B949E]">
            {currentQuestion.questionType === "SINGLE_CHOICE" ? "单选题" :
             currentQuestion.questionType === "MULTI_CHOICE" ? "多选题" : "思考题"}
          </span>
          <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs text-purple-400">
            {currentQuestion.xpReward} XP
          </span>
        </div>

        <h2 className="mb-4 text-lg font-semibold whitespace-pre-wrap">{currentQuestion.content}</h2>

        {/* Choice Questions */}
        {(currentQuestion.questionType === "SINGLE_CHOICE" || currentQuestion.questionType === "MULTI_CHOICE") &&
          currentQuestion.options && (
          <div className="space-y-2">
            {currentQuestion.options.map((opt) => {
              const currentAnswer = answers.get(currentQuestion.id.toString());
              const isSelected = currentQuestion.questionType === "MULTI_CHOICE"
                ? ((currentAnswer as string[]) || []).includes(opt.key)
                : currentAnswer === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelectOption(currentQuestion.id.toString(), opt.key, currentQuestion.questionType === "MULTI_CHOICE")}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    isSelected
                      ? "border-[#3B82F6] bg-[#3B82F6]/10 text-[#E6EDF3]"
                      : "border-[#30363D] bg-[#0D1117] text-[#8B949E] hover:border-[#3B82F6]/50"
                  }`}
                >
                  <span className="mr-2 font-mono font-bold">{opt.key}.</span>
                  {opt.content}
                </button>
              );
            })}
          </div>
        )}

        {/* Thinking Question */}
        {currentQuestion.questionType === "THINKING" && (
          <Textarea
            value={(answers.get(currentQuestion.id.toString()) as string) || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleThinkingAnswer(currentQuestion.id.toString(), e.target.value)
            }
            placeholder="请输入你的思考和分析..."
            rows={8}
          />
        )}

        {currentQuestion.explanation && (
          <p className="mt-4 text-xs text-[#8B949E]">
            提示：{currentQuestion.explanation.slice(0, 50)}...
          </p>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={isFirstQuestion}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          上一题
        </Button>
        <div className="flex gap-2">
          {!isLastQuestion ? (
            <Button
              variant="outline"
              onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
            >
              下一题
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button className="bg-green-600" onClick={() => setShowConfirm(true)} disabled={submitting}>
              <Send className="mr-2 h-4 w-4" />
              {submitting ? "提交中..." : "提交答卷"}
            </Button>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="mx-4 max-w-md border-[#30363D] bg-[#161B22] p-6">
            <div className="mb-4 flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-semibold">确认提交？</h3>
            </div>
            <p className="mb-2 text-sm text-[#8B949E]">
              你已回答 {answeredCount} / {totalQuestions} 题
            </p>
            {answeredCount < totalQuestions && (
              <p className="mb-4 text-sm text-yellow-400">
                还有 {totalQuestions - answeredCount} 题未作答
              </p>
            )}
            <p className="mb-4 text-sm text-[#8B949E]">提交后无法修改</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={submitting}>
                继续答题
              </Button>
              <Button className="bg-green-600" onClick={handleForceSubmit} disabled={submitting}>
                确认提交
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
