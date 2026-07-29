"use client";

import { useState } from "react";
import { proApi } from "@/lib/api";

const SAMPLE_DATA = [
  { month: "1月", gmv: 82, orders: 1200 },
  { month: "2月", gmv: 75, orders: 1050 },
  { month: "3月", gmv: 91, orders: 1380 },
  { month: "4月", gmv: 105, orders: 1550 },
  { month: "5月", gmv: 118, orders: 1720 },
  { month: "6月", gmv: 134, orders: 1960 },
];

const SUGGESTIONS = [
  "本月各渠道 GMV 对比如何？",
  "找出增长最快的时间段",
  "预测下月的销售趋势",
  "数据异常点在哪里？",
];

export default function DataAnalysisPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function handleQuery() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await proApi.analyzeData({ query });
      // axios 拦截器已解包，res 直接是数据
      setResult((res as any)?.insight || "");
    } catch {
      alert("分析失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI 数据分析</h1>
        <p className="text-gray-500 mb-6">上传数据文件，用自然语言提问，获得即时洞察</p>

        {/* 上传区域 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              loaded ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-green-300"
            }`}
            onClick={() => setLoaded(true)}
          >
            {loaded ? (
              <div>
                <div className="text-green-600 text-2xl mb-2">✓</div>
                <p className="text-green-700 font-medium">示例数据已加载（sales_2026_H1.csv）</p>
                <p className="text-sm text-green-600">6行 · 2列数据 · 时间范围：1月~6月</p>
              </div>
            ) : (
              <div>
                <div className="text-3xl mb-3">📂</div>
                <p className="text-gray-600 font-medium">拖拽上传或点击加载示例数据</p>
                <p className="text-sm text-gray-400 mt-1">支持 .xlsx / .csv，最大 10MB</p>
              </div>
            )}
          </div>
        </div>

        {loaded && (
          <>
            {/* 数据预览 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 overflow-x-auto">
              <h2 className="font-semibold text-gray-900 mb-3">数据预览</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-3 py-2 text-gray-500 font-medium">月份</th>
                    <th className="text-left px-3 py-2 text-gray-500 font-medium">GMV（万）</th>
                    <th className="text-left px-3 py-2 text-gray-500 font-medium">订单数</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_DATA.map((row) => (
                    <tr key={row.month} className="border-t border-gray-50">
                      <td className="px-3 py-2 text-gray-700">{row.month}</td>
                      <td className="px-3 py-2 text-gray-700">{row.gmv}</td>
                      <td className="px-3 py-2 text-gray-700">{row.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* GMV可视化 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
              <h2 className="font-semibold text-gray-900 mb-4">GMV 趋势</h2>
              <div className="flex items-end gap-3 h-32">
                {SAMPLE_DATA.map((row) => {
                  const max = Math.max(...SAMPLE_DATA.map((r) => r.gmv));
                  const h = Math.round((row.gmv / max) * 100);
                  return (
                    <div key={row.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-500">{row.gmv}</span>
                      <div
                        className="w-full bg-green-400 rounded-t-md"
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-xs text-gray-400">{row.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 提问 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
              <h2 className="font-semibold text-gray-900 mb-3">向数据提问</h2>
              <div className="flex gap-2 mb-3 flex-wrap">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="text-xs bg-gray-100 hover:bg-green-100 hover:text-green-700 text-gray-600 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="用自然语言提问，如：增长最快的月份是哪个？"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  onKeyDown={(e) => e.key === "Enter" && handleQuery()}
                />
                <button
                  onClick={handleQuery}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                >
                  {loading ? "分析中..." : "分析"}
                </button>
              </div>
            </div>

            {result && (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                <h3 className="font-semibold text-green-800 mb-2">AI 分析结果</h3>
                <pre className="text-sm text-green-900 whitespace-pre-wrap font-sans">{result}</pre>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
