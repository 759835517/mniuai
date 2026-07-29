"use client";

import { useState } from "react";
import Link from "next/link";

const HINTS = [
  { level: 1, label: "算法类型", text: "这道题可以用「哈希表」在 O(n) 时间内解决。" },
  { level: 2, label: "关键步骤", text: "遍历数组时，用哈希表记录每个数字的下标，检查 target - nums[i] 是否已存在。" },
  { level: 3, label: "伪代码框架", text: "map = {}\nfor i, n in enumerate(nums):\n  if target-n in map: return [map[target-n], i]\n  map[n] = i" },
  { level: 4, label: "完整题解", text: "时间复杂度 O(n)，空间复杂度 O(n)。单次遍历，边遍历边查找补数是否已记录，避免二次循环。" },
];

const LANGS = ["Java", "Python", "JavaScript", "Go"];

export default function AlgorithmProblemPage() {
  const [code, setCode] = useState(
    "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // 在此作答\n        return new int[]{};\n    }\n}"
  );
  const [lang, setLang] = useState("Java");
  const [hintLevel, setHintLevel] = useState(0);
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState<"desc" | "hint">("desc");

  const run = () => {
    setRunning(true);
    setTimeout(() => setRunning(false), 1200);
  };

  return (
    <div className="pt-16 h-screen flex flex-col bg-gray-900">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 text-white border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Link href="/algorithms" className="text-gray-400 hover:text-white text-sm">
            ← 题库
          </Link>
          <span className="font-semibold text-sm">1. 两数之和</span>
          <span className="text-xs px-2 py-0.5 rounded bg-green-600">简单</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-gray-700 text-sm rounded-lg px-2 py-1.5 outline-none"
          >
            {LANGS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <button
            onClick={run}
            disabled={running}
            className="text-sm bg-gray-600 hover:bg-gray-500 px-4 py-1.5 rounded-lg disabled:opacity-50"
          >
            {running ? "执行中…" : "▶ 运行"}
          </button>
          <button className="text-sm bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded-lg">
            提交
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        <div className="flex flex-col border-r border-gray-700 bg-gray-800">
          <div className="flex border-b border-gray-700 text-sm">
            <button
              onClick={() => setTab("desc")}
              className={`px-4 py-2 ${tab === "desc" ? "text-white border-b-2 border-orange-500" : "text-gray-400"}`}
            >
              题目描述
            </button>
            <button
              onClick={() => setTab("hint")}
              className={`px-4 py-2 ${tab === "hint" ? "text-white border-b-2 border-orange-500" : "text-gray-400"}`}
            >
              AI 提示
            </button>
          </div>
          <div className="flex-1 overflow-auto p-5 text-gray-300 text-sm leading-relaxed">
            {tab === "desc" ? (
              <>
                <p className="mb-3">
                  给定一个整数数组 nums 和一个整数目标值 target，请在数组中找出和为目标值的两个整数，返回它们的数组下标。
                </p>
                <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs mb-2">
                  <div>输入：nums = [2,7,11,15], target = 9</div>
                  <div>输出：[0,1]</div>
                </div>
                <p className="text-gray-400 text-xs">提示：2 ≤ nums.length ≤ 10⁴，只会存在一个有效答案。</p>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-400 text-xs">
                  逐级解锁提示，独立作答场景下 Level 4 完整题解会被记录使用情况。
                </p>
                {HINTS.slice(0, hintLevel).map((h) => (
                  <div key={h.level} className="bg-gray-900 rounded-lg p-3">
                    <div className="text-orange-400 text-xs font-semibold mb-1">
                      Level {h.level} · {h.label}
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-xs text-gray-300">{h.text}</pre>
                  </div>
                ))}
                {hintLevel < HINTS.length && (
                  <button
                    onClick={() => setHintLevel((l) => l + 1)}
                    className="w-full border border-orange-500/50 text-orange-400 hover:bg-orange-500/10 rounded-lg py-2 text-sm"
                  >
                    解锁 Level {hintLevel + 1} 提示 →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="px-4 py-2 bg-gray-800 text-xs text-gray-400 border-b border-gray-700">
            Solution.{lang.toLowerCase()}
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 bg-gray-900 text-gray-100 font-mono text-sm p-4 resize-none outline-none leading-relaxed"
          />
          <div className="h-36 bg-black text-gray-300 font-mono text-xs p-4 overflow-auto border-t border-gray-700">
            <div className="text-gray-500 mb-1">// 测试结果</div>
            {running ? (
              <div className="text-yellow-400">运行测试用例中…</div>
            ) : (
              <div className="text-gray-500">点击「运行」查看测试用例结果</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
