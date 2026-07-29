"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { eduApi } from "@/lib/api";

const SUBJECTS = ["语文", "数学", "英语", "物理", "化学", "历史", "政治", "生物"];
const GRADES = ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "初一", "初二", "初三", "高一", "高二", "高三"];
const QUESTION_TYPES = ["单选题", "多选题", "判断题", "填空题", "简答题", "计算题", "作文"];
const DIFFICULTIES = ["容易", "中等", "较难"];

export default function QuizPage() {
  const [form, setForm] = useState({
    subject: "数学",
    grade: "初二",
    knowledgePoints: "",
    types: ["单选题", "填空题"],
    difficulty: "中等",
    count: 10,
    withAnswer: true,
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const toggleType = (type: string) => {
    setForm((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const handleGenerate = async () => {
    if (!form.knowledgePoints.trim()) {
      alert("请填写知识点");
      return;
    }
    if (form.types.length === 0) {
      alert("请至少选择一种题型");
      return;
    }
    setQuestions([]);
    setIsStreaming(true);

    try {
      const res = await eduApi.generateQuiz({
        subject: form.subject,
        grade: form.grade,
       知识点: form.knowledgePoints,
        questionTypes: form.types,
        difficulty: form.difficulty,
        count: form.count,
        withAnswer: form.withAnswer,
      });
      // axios 拦截器已解包，res 直接是数据
      setQuestions(Array.isArray(res) ? res : []);
    } catch {
      alert("生成失败，请稍后重试。");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleExport = () => {
    const text = questions.map((q, i) =>
      `${i + 1}. [${q.type}] ${q.content}\n   选项：${q.options?.join(" / ") || "—"}\n   答案：${q.answer}\n   解析：${q.analysis || "—"}`
    ).join("\n\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.subject}-${form.grade}-试卷.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputPanel = (
    <div className="space-y-4">
      <h2 className="font-semibold text-gray-900">设置出题参数</h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">学科</label>
          <select name="subject" value={form.subject} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">年级</label>
          <select name="grade" value={form.grade} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
            {GRADES.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          知识点 <span className="text-red-500">*</span>
        </label>
        <textarea name="knowledgePoints" value={form.knowledgePoints} onChange={handleChange}
          rows={3} placeholder="例：一次函数的图像与性质、一元一次方程应用题..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">题型（可多选）</label>
        <div className="flex flex-wrap gap-2">
          {QUESTION_TYPES.map((type) => (
            <button key={type} onClick={() => toggleType(type)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                form.types.includes(type)
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
              }`}>
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">难度</label>
          <select name="difficulty" value={form.difficulty} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
            {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">题目数量</label>
          <input type="number" name="count" value={form.count}
            onChange={(e) => setForm((p) => ({ ...p, count: Number(e.target.value) }))}
            min={1} max={50}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="withAnswer" name="withAnswer" checked={form.withAnswer}
          onChange={handleChange} className="w-4 h-4 accent-orange-500" />
        <label htmlFor="withAnswer" className="text-sm text-gray-700">
          附带答案和解析
        </label>
      </div>

      <button onClick={handleGenerate} disabled={isStreaming}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors">
        {isStreaming ? "⚡ 正在出题..." : "🚀 AI生成题目"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        AI生成题目标注"建议人工核查"，计算类题目含完整解题过程
      </p>
    </div>
  );

  const outputPanel = (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">生成结果</h2>
        {questions.length > 0 && (
          <div className="flex gap-2">
            <button onClick={() => navigator.clipboard.writeText(JSON.stringify(questions))}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">
              复制
            </button>
            <button onClick={handleExport}
              className="text-xs px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600">
              导出试卷
            </button>
          </div>
        )}
      </div>

      {isStreaming ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-3" />
            <p className="text-sm text-gray-500">AI 正在出题...</p>
          </div>
        </div>
      ) : questions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-400">填写知识点和题型，点击「AI生成题目」</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4">
          {questions.map((q, i) => (
            <div key={q.id || i} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{q.type}</span>
                <span className="text-xs text-gray-400">#{i + 1}</span>
              </div>
              <p className="text-sm text-gray-800 mb-2">{q.content}</p>
              {q.options && q.options.length > 0 && (
                <div className="text-xs text-gray-500 mb-1">
                  选项：{q.options.join(" / ")}
                </div>
              )}
              <div className="text-xs text-green-600">答案：{q.answer}</div>
              {q.analysis && <div className="text-xs text-gray-400 mt-1">解析：{q.analysis}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <ToolLayout
      title="AI出题机"
      description="按知识点和难度自动出题，一键导出组卷"
      icon="📋"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
