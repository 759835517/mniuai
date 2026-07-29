"use client";

import { useState } from "react";
import { proApi } from "@/lib/api";

export default function MeetingPage() {
  const [topic, setTopic] = useState("");
  const [participants, setParticipants] = useState("");
  const [record, setRecord] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!record.trim()) return;
    setLoading(true);
    try {
      const res = await proApi.generateMeetingMinutes({
        topic: topic || undefined,
        participants: participants || undefined,
        record,
      });
      // axios 拦截器已解包，res 直接是数据
      setOutput((res as any)?.minutes || "");
    } catch {
      alert("生成失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI 会议纪要</h1>
        <p className="text-gray-500 mb-6">粘贴会议文字记录，AI自动提取决策和待办事项</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入 */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">会议基本信息</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">会议主题</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="如：Q3营销策略讨论"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">参与人</label>
                  <input
                    type="text"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                    placeholder="如：张三、李四、王五"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <label className="block font-semibold text-gray-900 mb-2">
                会议文字记录
                <span className="text-xs font-normal text-gray-400 ml-2">粘贴原始记录，支持杂乱格式</span>
              </label>
              <textarea
                value={record}
                onChange={(e) => setRecord(e.target.value)}
                placeholder="粘贴会议中的文字记录，可以是语音转写的文字、手打笔记，格式不限..."
                rows={10}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !record.trim()}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {loading ? "AI整理中..." : "生成会议纪要"}
              </button>
            </div>
          </div>

          {/* 输出 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">生成结果</h2>
              {output && (
                <button onClick={handleCopy} className="text-sm text-green-600 hover:underline">
                  {copied ? "已复制！" : "复制全文"}
                </button>
              )}
            </div>
            {output ? (
              <textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                className="w-full h-96 border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 font-mono"
              />
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-gray-300 border border-dashed border-gray-200 rounded-xl gap-2">
                <span className="text-3xl">🎙️</span>
                <span className="text-sm">粘贴会议记录后生成</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
