"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { interviewApi } from "@/lib/api/interview";
import type { MockInterview, InterviewQuestion } from "@/lib/types/interview";
import { Clock, Send, Mic, CheckCircle, Loader2 } from "lucide-react";

interface ChatMessage {
  role: "interviewer" | "candidate";
  content: string;
  timestamp: Date;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function MockInterviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [interview, setInterview] = useState<MockInterview | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamAbortRef = useRef<AbortController | null>(null);

  // Load interview
  useEffect(() => {
    interviewApi.getMock(id)
      .then((res) => {
        setInterview(res);
        // Parse question IDs from aiSummary (temporary storage)
        if (res.aiSummary) {
          try {
            const ids = JSON.parse(res.aiSummary) as string[];
            Promise.all(ids.map((qid) => interviewApi.getQuestion(qid)))
                  .then(setQuestions)
                  .catch(() => setQuestions([]));
          } catch {
            setQuestions([]);
          }
        }
      })
      .catch(() => setInterview(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming || questions.length === 0) return;

    const userMessage: ChatMessage = { role: "candidate", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;
    let aiResponse = "";

    try {
      // Use SSE stream
      const controller = new AbortController();
      streamAbortRef.current = controller;

      const response = await fetch(`/api/backend/interview/mock/${id}/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: currentQuestion.id, userAnswer: input }),
        signal: controller.signal,
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data:")) {
              try {
                const data = JSON.parse(line.slice(5));
                if (data.delta) {
                  aiResponse += data.delta;
                  setMessages((prev) => {
                    const last = prev[prev.length - 1];
                    if (last?.role === "interviewer") {
                      return [...prev.slice(0, -1), { ...last, content: aiResponse, timestamp: new Date() }];
                    }
                    return [...prev, { role: "interviewer", content: aiResponse, timestamp: new Date() }];
                  });
                }
              } catch { /* ignore parse errors */ }
            }
          }
        }
      }
    } catch {
      // Fallback: use regular answer API
      try {
        const result = await interviewApi.submitAnswer(id, {
          questionId: currentQuestion.id,
          userAnswer: input,
        });
        aiResponse = result.aiFeedback || "回答已记录";
        setMessages((prev) => [...prev, { role: "interviewer", content: aiResponse, timestamp: new Date() }]);
      } catch {
        aiResponse = "网络异常，请重试";
        setMessages((prev) => [...prev, { role: "interviewer", content: aiResponse, timestamp: new Date() }]);
      }
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, questions, currentIndex, id]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setMessages([]);
    }
  };

  const handleComplete = async () => {
    try {
      await interviewApi.complete(id);
      router.push(`/interview/mock/${id}/result`);
    } catch {
      alert("完成面试失败");
    }
  };

  if (loading) return <p className="text-[#8B949E]">加载中...</p>;
  if (!interview) return <p className="text-[#8B949E]">面试不存在</p>;

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex >= questions.length - 1;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mic className="h-5 w-5 text-[#3B82F6]" />
          <h1 className="text-xl font-bold">模拟面试</h1>
          <span className="rounded bg-[#30363D] px-2 py-0.5 text-xs text-[#8B949E]">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#8B949E]">
          <Clock className="h-4 w-4" />
          <span className="font-mono">{formatTime(elapsed)}</span>
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <Card className="border-[#30363D] bg-[#161B22] p-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded bg-[#3B82F6]/20 px-2 py-0.5 text-xs text-[#3B82F6]">{currentQuestion.category}</span>
            <span className={`rounded px-2 py-0.5 text-xs ${
              currentQuestion.difficulty === "EASY" ? "bg-green-500/20 text-green-400" :
              currentQuestion.difficulty === "MEDIUM" ? "bg-yellow-500/20 text-yellow-400" :
              "bg-red-500/20 text-red-400"
            }`}>{currentQuestion.difficulty}</span>
          </div>
          <h2 className="text-lg font-semibold">{currentQuestion.title}</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-[#8B949E]">{currentQuestion.content}</p>
        </Card>
      )}

      {/* Chat Messages */}
      <Card className="border-[#30363D] bg-[#0D1117] p-4">
        <div className="max-h-[400px] min-h-[200px] space-y-3 overflow-y-auto">
          {messages.length === 0 && (
            <p className="text-center text-[#8B949E]">请阅读题目后开始作答...</p>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "candidate" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === "candidate" ? "bg-[#3B82F6] text-white" : "bg-[#161B22] text-[#E6EDF3]"
              }`}>
                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                <p className="mt-1 text-xs opacity-60">{msg.timestamp.toLocaleTimeString("zh-CN")}</p>
              </div>
            </div>
          ))}
          {isStreaming && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-lg bg-[#161B22] p-3 text-[#8B949E]">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">AI 面试官正在回复...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Input */}
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
          placeholder="输入你的回答..."
          rows={3}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button onClick={sendMessage} disabled={isStreaming || !input.trim()} className="bg-[#3B82F6]">
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/interview")}>
          退出面试
        </Button>
        <div className="flex gap-2">
          {!isLastQuestion && (
            <Button variant="outline" onClick={handleNext}>
              下一题
            </Button>
          )}
          <Button className="bg-green-600" onClick={handleComplete}>
            <CheckCircle className="mr-2 h-4 w-4" />
            完成面试
          </Button>
        </div>
      </div>
    </div>
  );
}
