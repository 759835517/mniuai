"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Msg = { role: "interviewer" | "candidate"; content: string };

const OPENING: Msg = {
  role: "interviewer",
  content:
    "你好，我是今天的面试官。我们先从一道算法题开始：给定一个整数数组和目标值，找出数组中和为目标值的两个数的下标。你可以先说一下思路。",
};

export default function InterviewSessionPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [messages, setMessages] = useState<Msg[]>([OPENING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [ended, setEnded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ended) return;
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [ended]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fmtTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  async function handleSend() {
    if (!input.trim() || streaming) return;
    const answer = input.trim();
    setMessages((m) => [...m, { role: "candidate", content: answer }]);
    setInput("");
    setStreaming(true);
    setMessages((m) => [...m, { role: "interviewer", content: "" }]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/interview/answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
          },
          body: JSON.stringify({ sessionId, answer }),
        }
      );
      if (!res.body) throw new Error("no stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "interviewer",
            content: copy[copy.length - 1].content + chunk,
          };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "interviewer",
          content: "（连接面试服务失败，请检查后端服务是否启动）",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部状态栏 */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700">面试进行中</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono text-gray-500">
              ⏱ {fmtTime(elapsed)}
            </span>
            {ended ? (
              <Link
                href={`/interview/${sessionId}/report`}
                className="text-sm bg-blue-500 text-white px-4 py-1.5 rounded-full hover:bg-blue-600"
              >
                查看报告 →
              </Link>
            ) : (
              <button
                onClick={() => setEnded(true)}
                className="text-sm border border-red-200 text-red-500 px-4 py-1.5 rounded-full hover:bg-red-50"
              >
                结束面试
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 对话区 */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "candidate" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "candidate"
                  ? "bg-blue-500 text-white"
                  : "bg-white border border-gray-100 text-gray-800"
              }`}
            >
              {m.role === "interviewer" && (
                <div className="text-xs font-semibold text-blue-500 mb-1">
                  AI 面试官
                </div>
              )}
              {m.content || (
                <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse" />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 输入区 */}
      {!ended && (
        <div className="bg-white border-t border-gray-100 sticky bottom-0">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend();
                }}
                placeholder="输入你的回答…（Cmd/Ctrl + Enter 发送）"
                rows={3}
                className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={handleSend}
                disabled={streaming || !input.trim()}
                className="self-end bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 disabled:opacity-40 transition-colors"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
