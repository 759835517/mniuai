"use client";

import { useState } from "react";
import { proApi } from "@/lib/api";

const TYPES = [
  { id: "weekly", label: "工作周报", icon: "📅" },
  { id: "monthly", label: "月度述职", icon: "📊" },
  { id: "ppt", label: "汇报PPT大纲", icon: "🖥️" },
];

export default function ReportPage() {
  const [type, setType] = useState("weekly");
  const [content, setContent] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await proApi.generateReport({
        reportType: type,
        content,
      });
      // axios 拦截器已解包，res 直接是数据
      setOutput((res as any)?.content || "");
    } catch {
      alert("生成失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI 汇报材料</h1>
        <p className="text-gray-500 mb-6">输入工作内容，AI生成专业汇报材料</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-3">选择类型</h2>
              <div className="grid grid-cols-3 gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-colors ${
                      type === t.id ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xl">{t.icon}</span>
                    <span className={`text-xs font-medium ${type === t.id ? "text-green-700" : "text-gray-600"}`}>
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <label className="block font-semibold text-gray-900 mb-2">本期工作内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="列出本期主要工作内容、关键数据和成果（格式不限）..."
                rows={8}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {loading ? "AI生成中..." : "生成汇报材料"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">生成结果</h2>
              {output && (
                <button
                  onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="text-sm text-green-600 hover:underline"
                >
                  {copied ? "已复制！" : "复制全文"}
                </button>
              )}
            </div>
            {output ? (
              <textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                className="w-full h-80 border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 font-mono"
              />
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-300 border border-dashed border-gray-200 rounded-xl text-sm">
                选择类型并输入内容后生成
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
