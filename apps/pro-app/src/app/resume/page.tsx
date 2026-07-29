"use client";

import { useState } from "react";

const MOCK_RESULT = {
  atsScore: { before: 42, after: 78 },
  keywords: ["数据驱动", "用户增长", "A/B测试", "留存率", "漏斗分析"],
  suggestions: [
    { type: "量化成就", level: "high", before: "负责用户增长工作", after: "主导用户增长专项，3个月内DAU从10万提升至15万（+50%），付费转化率从2.8%提升至3.5%" },
    { type: "关键词补充", level: "high", before: "简历缺少岗位关键词", after: '建议在工作描述中加入：数据驱动、A/B测试、用户漏斗分析、留存率优化' },
    { type: "结构优化", level: "medium", before: "工作经历排列顺序不佳", after: "建议将最匹配的项目经验提前，突出与目标JD最相关的能力" },
    { type: "ATS通过率", level: "medium", before: "当前评分42分（较低）", after: "优化后预计提升至78分，通过自动筛选概率从15%提升至65%" },
  ],
};

export default function ResumePage() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<typeof MOCK_RESULT | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!resume.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setResult(MOCK_RESULT);
    setLoading(false);
  }

  const levelColor: Record<string, string> = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI 简历优化</h1>
        <p className="text-gray-500 mb-6">粘贴简历和目标JD，AI给出针对性优化建议，提升面试邀约率</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">你的简历内容</label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="粘贴简历文字内容（工作经历/项目/技能等）"
              rows={10}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">目标职位 JD（可选）</label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="粘贴目标职位的招聘描述，AI将针对JD进行定向优化"
              rows={10}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
            />
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !resume.trim()}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors mb-6"
        >
          {loading ? "AI分析中..." : "开始优化分析"}
        </button>

        {result && (
          <div className="space-y-5">
            {/* ATS评分 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">ATS 通过率预测</h2>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">{result.atsScore.before}</div>
                  <div className="text-xs text-gray-400 mt-1">当前分数</div>
                </div>
                <div className="text-2xl text-gray-300">→</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{result.atsScore.after}</div>
                  <div className="text-xs text-gray-400 mt-1">优化后预估</div>
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-100 rounded-full mb-1">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${result.atsScore.after}%` }} />
                  </div>
                  <div className="text-xs text-gray-400">面试邀约概率提升约 4倍</div>
                </div>
              </div>
            </div>

            {/* 关键词 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-3">建议补充关键词</h2>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((k) => (
                  <span key={k} className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* 优化建议 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4">优化建议</h2>
              <div className="space-y-4">
                {result.suggestions.map((s, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelColor[s.level]}`}>
                        {s.level === "high" ? "重要" : s.level === "medium" ? "建议" : "可选"}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{s.type}</span>
                    </div>
                    <p className="text-xs text-red-500 line-through mb-1">{s.before}</p>
                    <p className="text-sm text-green-700">{s.after}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
