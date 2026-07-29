"use client";

import { useState } from "react";
import { engineerApi } from "@/lib/api";

const LANGS = ["JavaScript", "TypeScript", "Python", "Java", "Go", "SQL"];

const DIMENSIONS = [
  { key: "correctness", label: "功能正确性", icon: "✅" },
  { key: "security", label: "安全性", icon: "🔒" },
  { key: "performance", label: "性能", icon: "⚡" },
  { key: "readability", label: "可读性", icon: "📖" },
  { key: "test", label: "测试覆盖", icon: "🧪" },
  { key: "standard", label: "工程规范", icon: "📐" },
];

export default function CodeReviewPage() {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("TypeScript");
  const [reviewing, setReviewing] = useState(false);
  const [report, setReport] = useState<string>("");

  const handleReview = async () => {
    if (!code.trim()) return;
    setReviewing(true);
    setReport("");
    try {
      const res = await engineerApi.reviewCode({ code, language: lang });
      // 格式化审查报告
      let text = `## 综合评分：${res.totalScore}/100\n\n`;
      if (res.criticalIssues.length > 0) {
        text += "## 🚨 严重问题\n";
        res.criticalIssues.forEach((issue) => {
          text += `- [${issue.dimension}] ${issue.before}，建议：${issue.after}\n`;
        });
        text += "\n";
      }
      if (res.improvements.length > 0) {
        text += "## ⚠️ 需要改进\n";
        res.improvements.forEach((issue) => {
          text += `- [${issue.dimension}] ${issue.before}，建议：${issue.after}\n`;
        });
        text += "\n";
      }
      if (res.goodPoints.length > 0) {
        text += "## ✅ 做得好的地方\n";
        res.goodPoints.forEach((point) => {
          text += `- ${point}\n`;
        });
      }
      setReport(text);
    } catch {
      setReport("审查失败，请稍后重试。");
    } finally {
      setReviewing(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI 代码审查</h1>
        <p className="text-gray-500 mb-6">
          粘贴代码，AI 从安全、性能、可读性、测试等 6 个维度给出审查报告。
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {DIMENSIONS.map((d) => (
            <span
              key={d.key}
              className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600"
            >
              {d.icon} {d.label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">代码</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1"
              >
                {LANGS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="在此粘贴需要审查的代码…"
              className="w-full h-96 border border-gray-200 rounded-xl p-4 font-mono text-sm focus:border-blue-400 focus:outline-none resize-none"
            />
            <button
              onClick={handleReview}
              disabled={reviewing || !code.trim()}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-full disabled:opacity-50"
            >
              {reviewing ? "审查中…" : "开始 AI 审查"}
            </button>
          </div>

          {/* 报告 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              审查报告
            </label>
            {report ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-700 h-96 overflow-auto">
                {report}
                {reviewing && <span className="animate-pulse">▊</span>}
              </pre>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-400 text-sm">
                审查报告将显示在这里
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
