"use client";

import { useState } from "react";
import type { Metadata } from "next";

const PROBLEM = {
  id: "1",
  title: "两数之和",
  difficulty: "简单",
  category: "算法基础",
  description: `给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。`,
  examples: [
    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explain: "nums[0] + nums[1] == 9，返回 [0, 1]" },
    { input: "nums = [3,2,4], target = 6", output: "[1,2]", explain: "" },
  ],
  starterCode: `function twoSum(nums: number[], target: number): number[] {
  // 在这里写你的代码

};`,
};

const HINTS = [
  "这道题考察的是哈希表的应用场景。",
  "遍历数组时，对于每个元素 x，你需要快速查找 target - x 是否存在。",
  "可以使用 Map 存储已经遍历过的元素和其下标。",
  "for (const [i, x] of nums.entries()) { if (map.has(target - x)) ... }",
];

export default function ProblemPage({ params }: { params: { problemId: string } }) {
  const [code, setCode] = useState(PROBLEM.starterCode);
  const [hintLevel, setHintLevel] = useState(-1);
  const [result, setResult] = useState<{ status: string; output: string } | null>(null);
  const [running, setRunning] = useState(false);

  async function handleRun() {
    setRunning(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 1200));
    setResult({ status: "通过", output: "测试用例 1: [0,1] ✓\n测试用例 2: [1,2] ✓\n\n执行时间: 68ms  内存: 42.1MB" });
    setRunning(false);
  }

  return (
    <div className="pt-16 h-screen flex flex-col bg-gray-900">
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Problem */}
        <div className="w-96 shrink-0 bg-white flex flex-col overflow-y-auto border-r border-gray-200">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-bold text-gray-900 text-lg">{PROBLEM.id}. {PROBLEM.title}</h1>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-600">{PROBLEM.difficulty}</span>
            </div>
          </div>
          <div className="p-5 flex-1">
            <p className="text-sm text-gray-700 whitespace-pre-line mb-5">{PROBLEM.description}</p>
            {PROBLEM.examples.map((ex, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 mb-3 text-xs font-mono">
                <div className="text-gray-500 mb-1">示例 {i + 1}:</div>
                <div>输入: {ex.input}</div>
                <div>输出: {ex.output}</div>
                {ex.explain && <div className="text-gray-400 mt-1">{ex.explain}</div>}
              </div>
            ))}

            {/* Hints */}
            <div className="mt-6">
              <div className="text-xs font-semibold text-gray-500 mb-3">🤖 AI逐级提示</div>
              {HINTS.slice(0, hintLevel + 1).map((hint, i) => (
                <div key={i} className="bg-blue-50 rounded-lg p-3 mb-2 text-xs text-blue-700">
                  Level {i + 1}: {hint}
                </div>
              ))}
              {hintLevel < HINTS.length - 1 && (
                <button
                  onClick={() => setHintLevel((l) => l + 1)}
                  className="w-full text-xs text-blue-500 hover:text-blue-600 border border-blue-200 rounded-lg py-2 transition-colors"
                >
                  {hintLevel === -1 ? "获取提示" : "下一级提示"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Editor */}
        <div className="flex-1 flex flex-col bg-gray-900">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
            <span className="text-xs text-gray-400">TypeScript</span>
            <button
              onClick={handleRun}
              disabled={running}
              className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-semibold px-5 py-1.5 rounded-lg transition-colors"
            >
              {running ? "运行中..." : "▶ 运行"}
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-gray-900 text-green-300 font-mono text-sm p-4 resize-none focus:outline-none"
            spellCheck={false}
          />
          {result && (
            <div className={`p-4 border-t ${result.status === "通过" ? "border-green-700 bg-green-900/30" : "border-red-700 bg-red-900/30"}`}>
              <div className={`font-semibold text-sm mb-2 ${result.status === "通过" ? "text-green-400" : "text-red-400"}`}>
                {result.status === "通过" ? "✓ 所有测试通过" : "✗ 测试未通过"}
              </div>
              <pre className="text-xs text-gray-300 whitespace-pre">{result.output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
