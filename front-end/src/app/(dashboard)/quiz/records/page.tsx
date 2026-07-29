"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quizApi } from "@/lib/api/quiz";
import type { ExamRecord } from "@/lib/types/quiz";
import { ClipboardList, CheckCircle, XCircle, ChevronRight, Loader2 } from "lucide-react";

export default function ExamRecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<ExamRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    quizApi.listMyRecords(0, 50)
      .then((res) => setRecords(res.items))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ClipboardList className="h-6 w-6 text-[#3B82F6]" />
        <h1 className="text-2xl font-bold">考试记录</h1>
      </div>

      {/* Records List */}
      {records.length === 0 ? (
        <Card className="border-[#30363D] bg-[#161B22] p-8 text-center">
          <p className="text-[#8B949E]">暂无考试记录</p>
          <Button className="mt-4 bg-[#3B82F6]" onClick={() => router.push("/quiz")}>
            去考试
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <Card key={record.id} className="border-[#30363D] bg-[#161B22] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    record.passed ? "bg-green-500/20" : "bg-red-500/20"
                  }`}>
                    {record.passed
                      ? <CheckCircle className="h-6 w-6 text-green-400" />
                      : <XCircle className="h-6 w-6 text-red-400" />
                    }
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{record.score}</span>
                      <span className={`rounded px-2 py-0.5 text-xs ${
                        record.passed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {record.passed ? "通过" : "未通过"}
                      </span>
                    </div>
                    <p className="text-sm text-[#8B949E]">
                      答对 {record.correctCount} / {record.totalQuestions} 题
                      {record.completedAt && (
                        <> · {new Date(record.completedAt).toLocaleDateString("zh-CN")}</>
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/quiz/result/${record.id}`)}
                >
                  查看详情
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Back */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => router.push("/quiz")}>
          返回测验列表
        </Button>
      </div>
    </div>
  );
}
