"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { interviewApi } from "@/lib/api";
import type { MockInterviewDetail, InterviewQuestion } from "@mniuai/api-client";

interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
  score?: number;
  feedback?: string;
}

export default function InterviewSessionPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const [interview, setInterview] = useState<MockInterviewDetail | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 开始面试
  const startInterview = useCallback(async () => {
    try {
      setInitializing(true);
      const response = await interviewApi.startMock({
        mode: "RANDOM",
        difficulty: "EASY",
        questionCount: 3,
      });
      // 获取面试详情
      const detail = await interviewApi.getMock(response.id);
      setInterview(detail);

      // 设置第一道题
      if (detail.questions && detail.questions.length > 0) {
        const firstQ = detail.questions[0];
        setCurrentQuestion(firstQ);
        setMessages([{
          id: `ai-${firstQ.id}`,
          role: "ai",
          content: `你好！我是今天的面试官。我们开始第一题：\n\n**${firstQ.title}**\n\n${firstQ.content}`,
          timestamp: new Date(),
        }]);
      }
    } catch (err) {
      console.error("Failed to start interview:", err);
      setError("开始面试失败，请确保已登录");
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    startInterview();
  }, [startInterview]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading || !interview || !currentQuestion) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // 提交答案
      const result = await interviewApi.submitAnswer(interview.id, {
        questionId: currentQuestion.id,
        userAnswer: userMsg.content,
      });

      // 更新面试详情
      const updated = await interviewApi.getMock(interview.id);
      setInterview(updated);

      // 添加 AI 反馈
      const aiMsg: Message = {
        id: `ai-${result.id}`,
        role: "ai",
        content: result.aiFeedback ?? "好的，我了解了。",
        timestamp: new Date(),
        score: result.aiScore ?? undefined,
      };

      // 查找下一道未回答的问题
      const answeredQuestionIds = new Set(
        updated.answers?.map(a => a.questionId.toString()) ?? []
      );
      const nextQ = updated.questions?.find(
        q => !answeredQuestionIds.has(q.id.toString()) && q.id.toString() !== currentQuestion.id.toString()
      );

      if (nextQ) {
        setCurrentQuestion(nextQ);
        aiMsg.content += `\n\n---\n\n**下一题：${nextQ.title}**\n\n${nextQ.content}`;
      } else {
        // 所有问题已回答，完成面试
        const completed = await interviewApi.completeInterview(interview.id);
        setInterview({ ...updated, status: "COMPLETED", overallScore: completed.overallScore ?? undefined });
        aiMsg.content += `\n\n---\n\n🎉 面试已完成！`;
        if (completed.overallScore != null) {
          aiMsg.content += `\n\n**总分：${completed.overallScore}/10**`;
        }
        if (completed.aiSummary) {
          aiMsg.content += `\n\n**AI 总结：**\n${completed.aiSummary}`;
        }
        setCurrentQuestion(null);
      }

      setMessages((m) => [...m, aiMsg]);
    } catch (err) {
      console.error("Failed to submit answer:", err);
      setError("提交答案失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete() {
    if (!interview) return;
    try {
      await interviewApi.completeInterview(interview.id);
      router.push("/interview");
    } catch (err) {
      console.error("Failed to complete interview:", err);
    }
  }

  if (initializing) {
    return (
      <div className="pt-16 h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">正在准备面试...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            去登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-lg">🤖</div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">AI面试官</div>
            <div className="text-xs text-green-500">
              ● {interview?.status === "COMPLETED" ? "面试结束" : "面试中"}
            </div>
          </div>
        </div>
        <button
          onClick={handleComplete}
          className="text-xs text-red-500 hover:text-red-600 border border-red-200 px-3 py-1.5 rounded-lg"
        >
          结束面试
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-4 max-w-3xl w-full mx-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
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
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.score !== undefined && (
                <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                  评分：<span className="font-semibold text-blue-600">{msg.score}/10</span>
                </div>
              )}
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
            disabled={interview?.status === "COMPLETED" || !currentQuestion}
            className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading || interview?.status === "COMPLETED" || !currentQuestion}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-semibold px-5 rounded-xl transition-colors text-sm"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
