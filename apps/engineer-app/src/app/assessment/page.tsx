"use client";

import { useState } from "react";
import Link from "next/link";

type Question = {
  id: number;
  category: string;
  text: string;
  options: { value: string; label: string }[];
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: "算法",
    text: "以下哪种数据结构最适合实现 LRU 缓存？",
    options: [
      { value: "a", label: "数组" },
      { value: "b", label: "哈希表 + 双向链表" },
      { value: "c", label: "二叉搜索树" },
      { value: "d", label: "栈" },
    ],
  },
  {
    id: 2,
    category: "算法",
    text: "快速排序的平均时间复杂度是？",
    options: [
      { value: "a", label: "O(n)" },
      { value: "b", label: "O(n log n)" },
      { value: "c", label: "O(n²)" },
      { value: "d", label: "O(log n)" },
    ],
  },
  {
    id: 3,
    category: "工程",
    text: "关于数据库索引，以下说法错误的是？",
    options: [
      { value: "a", label: "索引能加速查询" },
      { value: "b", label: "索引会降低写入性能" },
      { value: "c", label: "索引越多越好" },
      { value: "d", label: "联合索引遵循最左前缀原则" },
    ],
  },
  {
    id: 4,
    category: "系统设计",
    text: "高并发场景下，缓解数据库压力的常见手段不包括？",
    options: [
      { value: "a", label: "引入 Redis 缓存" },
      { value: "b", label: "读写分离" },
      { value: "c", label: "去掉所有索引" },
      { value: "d", label: "分库分表" },
    ],
  },
  {
    id: 5,
    category: "AI编程",
    text: "使用 AI 编程助手时，最佳实践是？",
    options: [
      { value: "a", label: "直接采用AI生成代码，不做审查" },
      { value: "b", label: "提供充分上下文，并审查/测试生成结果" },
      { value: "c", label: "只用于生成注释" },
      { value: "d", label: "完全不使用" },
    ],
  },
];

export default function AssessmentPage() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);

  const q = QUESTIONS[current];
  const progress = Math.round(((current + 1) / QUESTIONS.length) * 100);

  function selectOption(value: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  }

  function next() {
    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setFinished(true);
    }
  }

  if (!started) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-6">📊</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">能力诊断测评</h1>
          <p className="text-gray-500 mb-8">
            {QUESTIONS.length}
            道精选测评题，覆盖算法、工程、系统设计和AI编程。完成后AI将分析你的水平与薄弱项，推荐专属学习路径。
          </p>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">测评说明</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• 预计用时 5~10 分钟</li>
              <li>• 覆盖算法/工程/系统设计/AI编程四个维度</li>
              <li>• 结果永久免费，可作为学习起点</li>
            </ul>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
          >
            开始测评 →
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    const answered = Object.keys(answers).length;
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">测评完成</h1>
          <p className="text-gray-500 mb-8">
            你已完成 {answered}/{QUESTIONS.length}{" "}
            题。AI正在分析你的答题结果，生成能力画像与学习路径建议。
          </p>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
            <div className="text-sm text-gray-400 mb-2">初步评估等级</div>
            <div className="text-4xl font-bold text-orange-500 mb-4">L2 中级</div>
            <div className="text-sm text-gray-600">
              薄弱项：系统设计、动态规划。建议从「中高级路径」开始。
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/paths"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full transition-colors"
            >
              查看推荐路径 →
            </Link>
            <Link
              href="/login"
              className="border border-gray-300 bg-white hover:border-orange-300 text-gray-700 font-semibold px-8 py-4 rounded-full transition-colors"
            >
              注册保存结果
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>
              第 {current + 1} / {QUESTIONS.length} 题
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100">
          <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
            {q.category}
          </span>
          <h2 className="text-xl font-bold text-gray-900 mt-4 mb-6">{q.text}</h2>
          <div className="space-y-3">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => selectOption(opt.value)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                  answers[q.id] === opt.value
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-100 hover:border-orange-200"
                }`}
              >
                <span className="font-medium text-gray-700">
                  {opt.value.toUpperCase()}.
                </span>{" "}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="px-6 py-3 rounded-full border border-gray-300 text-gray-600 disabled:opacity-40 hover:border-gray-400 transition-colors"
          >
            上一题
          </button>
          <button
            onClick={next}
            disabled={!answers[q.id]}
            className="px-8 py-3 rounded-full bg-orange-500 text-white font-semibold disabled:opacity-40 hover:bg-orange-600 transition-colors"
          >
            {current === QUESTIONS.length - 1 ? "提交测评" : "下一题"}
          </button>
        </div>
      </div>
    </div>
  );
}
