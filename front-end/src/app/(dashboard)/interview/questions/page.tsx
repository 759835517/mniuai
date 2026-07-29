"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { interviewApi } from "@/lib/api/interview";
import type { InterviewQuestion } from "@/lib/types/interview";
import { Eye, Building2, Tag } from "lucide-react";

const CATEGORIES = [
  { value: "", label: "全部分类" },
  { value: "JAVA", label: "Java" },
  { value: "ALGORITHM", label: "算法" },
  { value: "SYSTEM_DESIGN", label: "系统设计" },
  { value: "AI", label: "AI/ML" },
  { value: "DATABASE", label: "数据库" },
  { value: "BEHAVIORAL", label: "行为面试" },
];

const DIFFICULTIES = [
  { value: "", label: "全部难度" },
  { value: "EASY", label: "简单" },
  { value: "MEDIUM", label: "中等" },
  { value: "HARD", label: "困难" },
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await interviewApi.listQuestions({ category: category || undefined, difficulty: difficulty || undefined });
      setQuestions(res.items);
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [category, difficulty]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">题库</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded border border-[#30363D] bg-[#0D1117] px-3 py-2 text-sm text-[#F0F6FC]"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="rounded border border-[#30363D] bg-[#0D1117] px-3 py-2 text-sm text-[#F0F6FC]"
        >
          {DIFFICULTIES.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>

      {/* Question List */}
      {loading ? (
        <p className="text-[#8B949E]">加载中...</p>
      ) : questions.length === 0 ? (
        <Card className="border-[#30363D] bg-[#161B22] p-12 text-center">
          <p className="text-[#8B949E]">暂无题目</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <Card key={q.id} className="border-[#30363D] bg-[#161B22] p-4">
              <div
                className="cursor-pointer"
                onClick={() => setExpanded(expanded === q.id ? null : q.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="rounded bg-[#3B82F6]/20 px-2 py-0.5 text-xs text-[#3B82F6]">{q.category}</span>
                      <span className={`rounded px-2 py-0.5 text-xs ${
                        q.difficulty === "EASY" ? "bg-green-500/20 text-green-400" :
                        q.difficulty === "MEDIUM" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>{q.difficulty}</span>
                      {q.subCategory && (
                        <span className="rounded bg-[#30363D] px-2 py-0.5 text-xs text-[#8B949E]">{q.subCategory}</span>
                      )}
                    </div>
                    <h3 className="font-medium">{q.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#8B949E]">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{q.viewCount}</span>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expanded === q.id && (
                <div className="mt-4 space-y-3 border-t border-[#30363D] pt-4">
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-[#8B949E]">题目描述</h4>
                    <p className="whitespace-pre-wrap text-sm text-[#E6EDF3]">{q.content}</p>
                  </div>
                  {q.keyPoints.length > 0 && (
                    <div>
                      <h4 className="mb-1 text-sm font-medium text-[#8B949E]">考察点</h4>
                      <div className="flex flex-wrap gap-1">
                        {q.keyPoints.map((kp) => (
                          <span key={kp} className="rounded bg-[#8B5CF6]/20 px-2 py-0.5 text-xs text-[#8B5CF6]">{kp}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {q.companies.length > 0 && (
                    <div>
                      <h4 className="mb-1 text-sm font-medium text-[#8B949E]">出题公司</h4>
                      <div className="flex flex-wrap gap-1">
                        {q.companies.map((c) => (
                          <span key={c} className="flex items-center gap-1 rounded bg-[#30363D] px-2 py-0.5 text-xs text-[#8B949E]">
                            <Building2 className="h-3 w-3" />{c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {q.tags.length > 0 && (
                    <div>
                      <h4 className="mb-1 text-sm font-medium text-[#8B949E]">标签</h4>
                      <div className="flex flex-wrap gap-1">
                        {q.tags.map((t) => (
                          <span key={t} className="flex items-center gap-1 rounded bg-[#30363D] px-2 py-0.5 text-xs text-[#8B949E]">
                            <Tag className="h-3 w-3" />{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
