"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { kidsApi } from "@/lib/apiClient";
import type { CompetitionProblem, CompetitionSubmission } from "@mniuai/api-client";

/**
 * 竞赛题目详情页
 * 展示题目描述、代码编辑器、提交功能
 */
export default function ProblemDetailPage() {
  const params = useParams();
  const problemId = Number(params.problemId);

  const [problem, setProblem] = useState<CompetitionProblem | null>(null);
  const [code, setCode] = useState<string>("# 在这里编写你的 Python 代码\n");
  const [language, setLanguage] = useState<string>("python");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CompetitionSubmission | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (problemId) {
      loadProblem();
    }
  }, [problemId]);

  async function loadProblem() {
    try {
      setLoading(true);
      const data = await kidsApi.getCompetitionProblem(problemId);
      setProblem(data);
    } catch (err) {
      setError("加载题目失败");
      console.error("Failed to load problem:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = useCallback(async () => {
    if (!code.trim()) {
      setError("请输入代码");
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      const data = await kidsApi.submitCompetitionCode(problemId, language, code);
      setResult(data);
    } catch (err) {
      setError("提交失败，请稍后重试");
      console.error("Failed to submit:", err);
    } finally {
      setSubmitting(false);
    }
  }, [code, language, problemId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-bounce">⏳</div>
          <p className="text-gray-500 mt-4">加载中...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">❌</div>
          <p className="text-gray-500">题目不存在</p>
          <Link href="/competition" className="text-indigo-500 text-sm mt-2 inline-block">
            ← 返回题库
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 顶部导航 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/competition" className="flex items-center gap-2">
            <span className="text-2xl">🐮</span>
            <span className="font-bold text-indigo-600">萌牛少儿编程</span>
          </Link>
          <Link href="/competition" className="text-sm text-gray-500 hover:text-indigo-600">
            ← 返回题库
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：题目描述 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{problem.title}</h2>

            <div className="flex gap-2 mb-4">
              <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                {problem.category}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                {problem.difficulty}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                ⏱ {problem.timeLimitMs}ms
              </span>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700 mb-4">
              <p className="whitespace-pre-wrap">{problem.content}</p>
            </div>

            {problem.inputFormat && (
              <div className="mb-3">
                <h4 className="font-medium text-gray-700 text-sm mb-1">输入格式</h4>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{problem.inputFormat}</p>
              </div>
            )}

            {problem.outputFormat && (
              <div className="mb-3">
                <h4 className="font-medium text-gray-700 text-sm mb-1">输出格式</h4>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{problem.outputFormat}</p>
              </div>
            )}

            {problem.sampleInput && (
              <div className="mb-3">
                <h4 className="font-medium text-gray-700 text-sm mb-1">样例输入</h4>
                <pre className="text-sm bg-gray-900 text-green-400 rounded-lg p-3 font-mono">
                  {problem.sampleInput}
                </pre>
              </div>
            )}

            {problem.sampleOutput && (
              <div className="mb-3">
                <h4 className="font-medium text-gray-700 text-sm mb-1">样例输出</h4>
                <pre className="text-sm bg-gray-900 text-green-400 rounded-lg p-3 font-mono">
                  {problem.sampleOutput}
                </pre>
              </div>
            )}

            {problem.hint && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="font-medium text-yellow-700 text-sm mb-1">💡 提示</h4>
                <p className="text-sm text-yellow-700">{problem.hint}</p>
              </div>
            )}
          </div>

          {/* 右侧：代码编辑器 */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800">代码编辑器</h3>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1"
                >
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              {/* 简易代码编辑区 */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="在这里编写你的代码..."
                spellCheck={false}
              />

              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "提交中..." : "🚀 提交代码"}
                </button>
                {error && <span className="text-sm text-red-500">{error}</span>}
              </div>
            </div>

            {/* 提交结果 */}
            {result && (
              <div className={`rounded-2xl p-4 border ${
                result.status === "ACCEPTED"
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}>
                <h3 className="font-bold mb-2">
                  {result.status === "ACCEPTED" ? "✅ 通过！" : "❌ 未通过"}
                </h3>
                <div className="text-sm space-y-1">
                  <p>状态：<span className="font-medium">{result.status}</span></p>
                  <p>通过测试：{result.passedCount} / {result.totalCount}</p>
                  <p>运行时间：{result.runtimeMs} ms</p>
                  <p>内存消耗：{result.memoryKb} KB</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
