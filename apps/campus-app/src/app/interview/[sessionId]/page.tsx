"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "ai" | "user"; content: string; timestamp: Date };

const OPENING: Record<string, string> = {
  "algorithm-session": "你好！我是今天的算法面试官。我们今天来做一道中等难度的题目：**给定一个整数数组，找出其中和最大的连续子数组，返回其最大和。** 请先说说你的解题思路？",
  "project-session": "你好！我是今天的面试官。请先做一个自我介绍，重点介绍一下你最有价值的项目经历。",
  "behavioral-session": "你好！我们今天进行行为面试。第一个问题：请描述一次你和团队成员产生了重大分歧，最终是如何解决的？",
};

export default function InterviewSessionPage({ params }: { params: { sessionId: string } }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: OPENING[params.sessionId] ?? OPENING["algorithm-session"], timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input, timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1500));

    const aiReply: Message = {
      role: "ai",
      content: "好的，你提到了使用动态规划的思路。能具体说说状态转移方程吗？dp[i] 表示以第 i 个元素**结尾**的最大子数组和，你觉得它和 dp[i-1] 之间是什么关系？",
      timestamp: new Date(),
    };
    setMessages((m) => [...m, aiReply]);
    setLoading(false);
  }

  return (
    <div className="pt-16 h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-lg">🤖</div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">AI面试官</div>
            <div className="text-xs text-green-500">● 面试中</div>
          </div>
        </div>
        <button className="text-xs text-red-500 hover:text-red-600 border border-red-200 px-3 py-1.5 rounded-lg">
          结束面试
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-4 max-w-3xl w-full mx-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm ${
              msg.role === "ai" ? "bg-blue-100" : "bg-gray-200"
            }`}>
              {msg.role === "ai" ? "🤖" : "👤"}
            </div>
            <div className={`max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "ai"
                ? "bg-white border border-gray-100 text-gray-800"
                : "bg-blue-500 text-white"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm">🤖</div>
            <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-400">
              思考中<span className="animate-pulse">...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="输入你的回答... (Enter发送，Shift+Enter换行)"
            rows={2}
            className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-semibold px-5 rounded-xl transition-colors text-sm"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
