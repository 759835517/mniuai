"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { engineerApi } from "@/lib/api";

const DIFFICULTIES = ["全部", "简单", "中等", "困难"];
const CATEGORIES = [
  "全部",
  "数组",
  "链表",
  "树",
  "图",
  "动态规划",
  "贪心",
  "回溯",
  "双指针",
];

const DIFF_COLOR: Record<string, string> = {
  简单: "text-green-600 bg-green-50",
  中等: "text-orange-600 bg-orange-50",
  困难: "text-red-600 bg-red-50",
};

const PAGE_SIZE = 20;

export default function AlgorithmsPage() {
  const [diff, setDiff] = useState("全部");
  const [cat, setCat] = useState("全部");
  const [problems, setProblems] = useState<
    { id: string; title: string; difficulty: string; category: string; acceptance: string; solved: boolean }[]
  >([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadAlgorithms = useCallback(async () => {
    setLoading(true);
    try {
      const params: { page: number; pageSize: number; difficulty?: string; category?: string } = {
        page,
        pageSize: PAGE_SIZE,
      };
      if (diff !== "全部") params.difficulty = diff;
      if (cat !== "全部") params.category = cat;
      const res = await engineerApi.listAlgorithms(params);
      setProblems(res.list);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch {
      // fallback to mock data
      setProblems([
        { id: "1", title: "两数之和", difficulty: "简单", category: "数组", acceptance: "52%", solved: true },
        { id: "2", title: "反转链表", difficulty: "简单", category: "链表", acceptance: "74%", solved: true },
        { id: "3", title: "二叉树的最大深度", difficulty: "简单", category: "树", acceptance: "78%", solved: false },
        { id: "4", title: "最长回文子串", difficulty: "中等", category: "动态规划", acceptance: "36%", solved: false },
        { id: "5", title: "三数之和", difficulty: "中等", category: "双指针", acceptance: "38%", solved: false },
        { id: "6", title: "岛屿数量", difficulty: "中等", category: "图", acceptance: "60%", solved: false },
        { id: "7", title: "全排列", difficulty: "中等", category: "回溯", acceptance: "79%", solved: false },
        { id: "8", title: "接雨水", difficulty: "困难", category: "双指针", acceptance: "62%", solved: false },
        { id: "9", title: "最长有效括号", difficulty: "困难", category: "动态规划", acceptance: "36%", solved: false },
        { id: "10", title: "合并K个升序链表", difficulty: "困难", category: "链表", acceptance: "58%", solved: false },
      ]);
      setTotalPages(1);
      setTotal(10);
    } finally {
      setLoading(false);
    }
  }, [page, diff, cat]);

  useEffect(() => {
    loadAlgorithms();
  }, [loadAlgorithms]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [diff, cat]);

  const solvedCount = problems.filter((p) => p.solved).length;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">算法题库</h1>
              <p className="text-sm text-gray-500">
                精选 500 题，覆盖高频面试题，AI 逐级提示
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-500">
                {solvedCount}
                <span className="text-sm text-gray-400"> / {total}</span>
              </div>
              <div className="text-xs text-gray-400">已解决 / 总题数</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 bg-white border-b border-gray-100 sticky top-16 z-10">
        <div className="max-w-5xl mx-auto px-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 w-12">难度</span>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDiff(d)}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${
                  diff === d
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 w-12">分类</span>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${
                  cat === c
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="max-w-5xl mx-auto px-4">
          {loading ? (
            <div className="py-12 text-center text-gray-400 text-sm">加载中…</div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {problems.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/algorithms/${p.id}`}
                  className={`flex items-center gap-4 px-6 py-4 hover:bg-orange-50 transition-colors ${
                    i !== problems.length - 1 ? "border-b border-gray-50" : ""
                  }`}
                >
                  <span className="w-5 text-center">
                    {p.solved ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-gray-300">○</span>
                    )}
                  </span>
                  <span className="flex-1 font-medium text-gray-900">
                    {p.id}. {p.title}
                  </span>
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {p.category}
                  </span>
                  <span className="text-xs text-gray-400 w-12 text-right hidden sm:block">
                    {p.acceptance}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${DIFF_COLOR[p.difficulty]}`}
                  >
                    {p.difficulty}
                  </span>
                </Link>
              ))}
              {problems.length === 0 && !loading && (
                <div className="py-12 text-center text-gray-400 text-sm">
                  没有符合条件的题目
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-600 disabled:opacity-40 hover:bg-gray-200"
              >
                上一页
              </button>
              <span className="text-sm text-gray-500">
                第 {page} / {totalPages} 页（共 {total} 题）
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-600 disabled:opacity-40 hover:bg-gray-200"
              >
                下一页
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
