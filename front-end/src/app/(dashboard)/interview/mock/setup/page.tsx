"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { interviewApi } from "@/lib/api/interview";
import type { InterviewSet } from "@/lib/types/interview";
import { Shuffle, Target, TrendingDown, BookOpen } from "lucide-react";

const CATEGORIES = [
  { value: "JAVA", label: "Java" },
  { value: "ALGORITHM", label: "算法" },
  { value: "SYSTEM_DESIGN", label: "系统设计" },
  { value: "AI", label: "AI/ML" },
  { value: "DATABASE", label: "数据库" },
  { value: "BEHAVIORAL", label: "行为面试" },
];

const DIFFICULTIES = [
  { value: "", label: "不限" },
  { value: "EASY", label: "简单" },
  { value: "MEDIUM", label: "中等" },
  { value: "HARD", label: "困难" },
];

export default function MockSetupPage() {
  const router = useRouter();
  const [sets, setSets] = useState<InterviewSet[]>([]);
  const [mode, setMode] = useState<"SET" | "RANDOM" | "WEAK">("RANDOM");
  const [selectedSet, setSelectedSet] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    interviewApi.listSets(0, 50).then((res) => setSets(res.items)).catch(() => setSets([]));
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleStart = async () => {
    setStarting(true);
    try {
      const payload: { mode: "SET" | "RANDOM" | "WEAK"; interviewSetId?: string; categories?: string[]; difficulty?: string; questionCount?: number } = { mode };
      if (mode === "SET" && selectedSet) {
        payload.interviewSetId = selectedSet;
      }
      if (mode === "RANDOM") {
        if (selectedCategories.length > 0) payload.categories = selectedCategories;
        if (difficulty) payload.difficulty = difficulty;
        payload.questionCount = questionCount;
      }
      if (mode === "WEAK") {
        payload.questionCount = questionCount;
      }
      const interview = await interviewApi.startMock(payload);
      router.push(`/interview/mock/${interview.id}`);
    } catch {
      alert("开始面试失败，请重试");
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">模拟面试配置</h1>

      {/* Mode Selection */}
      <Card className="border-[#30363D] bg-[#161B22] p-6">
        <h2 className="mb-4 font-semibold">选择模式</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <button
            onClick={() => setMode("SET")}
            className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition ${
              mode === "SET" ? "border-[#3B82F6] bg-[#3B82F6]/10" : "border-[#30363D] hover:border-[#3B82F6]/50"
            }`}
          >
            <BookOpen className="h-6 w-6" />
            <span className="font-medium">套题模式</span>
            <span className="text-xs text-[#8B949E]">固定题目组合</span>
          </button>
          <button
            onClick={() => setMode("RANDOM")}
            className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition ${
              mode === "RANDOM" ? "border-[#3B82F6] bg-[#3B82F6]/10" : "border-[#30363D] hover:border-[#3B82F6]/50"
            }`}
          >
            <Shuffle className="h-6 w-6" />
            <span className="font-medium">随机模式</span>
            <span className="text-xs text-[#8B949E]">按条件随机出题</span>
          </button>
          <button
            onClick={() => setMode("WEAK")}
            className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition ${
              mode === "WEAK" ? "border-[#3B82F6] bg-[#3B82F6]/10" : "border-[#30363D] hover:border-[#3B82F6]/50"
            }`}
          >
            <TrendingDown className="h-6 w-6" />
            <span className="font-medium">薄弱项模式</span>
            <span className="text-xs text-[#8B949E]">针对薄弱分类</span>
          </button>
        </div>
      </Card>

      {/* Config based on mode */}
      {mode === "SET" && (
        <Card className="border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-4 font-semibold">选择套题</h2>
          {sets.length === 0 ? (
            <p className="text-[#8B949E]">暂无可用套题</p>
          ) : (
            <div className="space-y-2">
              {sets.map((set) => (
                <button
                  key={set.id}
                  onClick={() => setSelectedSet(set.id)}
                  className={`w-full rounded border p-3 text-left transition ${
                    selectedSet === set.id ? "border-[#3B82F6] bg-[#3B82F6]/10" : "border-[#30363D] hover:border-[#3B82F6]/50"
                  }`}
                >
                  <p className="font-medium">{set.title}</p>
                  <p className="text-xs text-[#8B949E]">{set.description}</p>
                </button>
              ))}
            </div>
          )}
        </Card>
      )}

      {mode === "RANDOM" && (
        <Card className="border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-4 font-semibold">随机出题配置</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-[#8B949E]">题目分类（多选）</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => toggleCategory(cat.value)}
                    className={`rounded px-3 py-1.5 text-sm transition ${
                      selectedCategories.includes(cat.value)
                        ? "bg-[#3B82F6] text-white"
                        : "bg-[#30363D] text-[#8B949E] hover:bg-[#3B82F6]/20"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm text-[#8B949E]">难度</label>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value)}
                    className={`rounded px-3 py-1.5 text-sm transition ${
                      difficulty === d.value ? "bg-[#3B82F6] text-white" : "bg-[#30363D] text-[#8B949E] hover:bg-[#3B82F6]/20"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm text-[#8B949E]">题目数量: {questionCount}</label>
              <input
                type="range"
                min={3}
                max={10}
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                className="w-full"
              />
            </div>
          </div>
        </Card>
      )}

      {mode === "WEAK" && (
        <Card className="border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-4 font-semibold">薄弱项模式</h2>
          <p className="mb-4 text-sm text-[#8B949E]">系统将根据您的能力画像，从最薄弱的分类中随机出题。</p>
          <div>
            <label className="mb-2 block text-sm text-[#8B949E]">题目数量: {questionCount}</label>
            <input
              type="range"
              min={3}
              max={10}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
        </Card>
      )}

      {/* Start Button */}
      <div className="flex justify-end">
        <Button
          className="bg-[#3B82F6] px-8"
          onClick={handleStart}
          disabled={starting || (mode === "SET" && !selectedSet)}
        >
          <Target className="mr-2 h-4 w-4" />
          {starting ? "创建中..." : "开始面试"}
        </Button>
      </div>
    </div>
  );
}
