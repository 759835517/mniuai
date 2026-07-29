"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { interviewApi } from "@/lib/api";

const MODES = [
  { id: "RANDOM", name: "随机练习", icon: "🎲", desc: "从题库随机抽题，适合日常练习" },
  { id: "SET", name: "套题模拟", icon: "📋", desc: "按套题组卷，模拟真实面试流程" },
  { id: "WEAK", name: "薄弱专项", icon: "🎯", desc: "针对薄弱维度专项突破" },
];

const CATEGORIES = ["算法", "系统设计", "项目", "行为"];
const DIFFICULTIES = ["简单", "中等", "困难"];

function NewInterviewPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") || "algorithm";

  const [mode, setMode] = useState<"RANDOM" | "SET" | "WEAK">("RANDOM");
  const [targetRole, setTargetRole] = useState("");
  const [categories, setCategories] = useState<string[]>([typeParam]);
  const [difficulty, setDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const startInterview = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await interviewApi.startMock({
        mode,
        targetRole: targetRole || undefined,
        categories: categories.length > 0 ? categories : undefined,
        difficulty: difficulty || undefined,
        questionCount,
      });
      router.push(`/interview/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "开始面试失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">开始 AI 面试</h1>
          <p className="text-sm text-gray-500">选择面试模式，AI 将为你生成个性化追问</p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          {/* Mode Selection */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">面试模式</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as "RANDOM" | "SET" | "WEAK")}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    mode === m.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-100 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-2">{m.icon}</div>
                  <div className="font-semibold text-gray-900 text-sm">{m.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Role */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">目标岗位（可选）</h2>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="如：Java 后端工程师、算法工程师"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">考察维度</h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    categories.includes(cat)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">难度（可选）</h2>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(difficulty === d ? "" : d)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    difficulty === d
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">题目数量: {questionCount}</h2>
            <input
              type="range"
              min={3}
              max={10}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>3题</span>
              <span>10题</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={startInterview}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {loading ? "创建面试中…" : "开始面试 →"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function NewInterviewPage() {
  return (
    <Suspense fallback={<div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-400 text-sm">加载中…</div></div>}>
      <NewInterviewPageInner />
    </Suspense>
  );
}
