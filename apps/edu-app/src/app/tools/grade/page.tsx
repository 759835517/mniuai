"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { eduApi } from "@/lib/api";

interface GradeResult {
  id: string;
  subject: string;
  totalScore: number;
  items: {
    questionNumber: number;
    score: number;
    maxScore: number;
    comment: string;
    confidence: number;
  }[];
  createdAt: string;
}

export default function GradePage() {
  const [question, setQuestion] = useState("");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [standardAnswer, setStandardAnswer] = useState("");
  const [subject, setSubject] = useState("数学");
  const [result, setResult] = useState<GradeResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGrade = async () => {
    if (!question.trim() || !studentAnswer.trim()) {
      alert("请填写题目和学生答案");
      return;
    }
    setIsProcessing(true);
    setResult(null);

    try {
      const res = await eduApi.gradeSubmission({
        subject,
        question,
        studentAnswer,
        standardAnswer: standardAnswer || undefined,
      });
      // axios 拦截器已解包，res 直接是数据
      setResult(res as unknown as GradeResult || null);
    } catch {
      alert("批改失败，请稍后重试");
    } finally {
      setIsProcessing(false);
    }
  };

  const inputPanel = (
    <div className="space-y-4">
      <h2 className="font-semibold text-gray-900">AI 批改</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">学科</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
          {["语文", "数学", "英语", "物理", "化学"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          题目 <span className="text-red-500">*</span>
        </label>
        <textarea name="question" value={question} onChange={(e) => setQuestion(e.target.value)}
          rows={3} placeholder="例：解方程 x²+2x-3=0"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          学生答案 <span className="text-red-500">*</span>
        </label>
        <textarea name="studentAnswer" value={studentAnswer} onChange={(e) => setStudentAnswer(e.target.value)}
          rows={4} placeholder="例：x = 1 或 x = -3"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          参考答案 <span className="text-gray-400 font-normal">(选填)</span>
        </label>
        <textarea name="standardAnswer" value={standardAnswer} onChange={(e) => setStandardAnswer(e.target.value)}
          rows={2} placeholder="例：x = 1 或 x = -3"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
      </div>

      <button onClick={handleGrade} disabled={isProcessing}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors">
        {isProcessing ? "⚡ AI批改中..." : "🚀 开始批改"}
      </button>
      <p className="text-xs text-gray-400 text-center">
        AI 评分仅供参考，低置信度结果会标记需人工复核
      </p>
    </div>
  );

  const outputPanel = (
    <div>
      {!result && !isProcessing ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-gray-400 text-sm">填写题目和学生答案后点击批改</p>
        </div>
      ) : isProcessing ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="flex gap-1 mb-4">
            {[0, 150, 300].map((delay) => (
              <span key={delay}
                style={{ animationDelay: `${delay}ms` }}
                className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" />
            ))}
          </div>
          <p className="text-gray-500">AI 批改中，请稍候...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">批改结果</h3>
            <button onClick={() => navigator.clipboard.writeText(JSON.stringify(result))}
              className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-300">
              复制结果
            </button>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-orange-500 mb-1">{result!.totalScore}</div>
            <div className="text-sm text-gray-500">总分</div>
          </div>

          <div className="space-y-3">
            {result!.items.map((item) => (
              <div key={item.questionNumber} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">第 {item.questionNumber} 题</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-orange-500">{item.score}/{item.maxScore}</span>
                    {item.confidence < 0.8 && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                        需人工复核
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{item.comment}</p>
                <div className="mt-2 text-xs text-gray-400">
                  置信度：{(item.confidence * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ToolLayout
      title="AI批改助手"
      description="输入题目和学生答案，AI自动批改评分"
      icon="✅"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
