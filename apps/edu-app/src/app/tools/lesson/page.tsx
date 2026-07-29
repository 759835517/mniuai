"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { AIStreamOutput } from "@/components/tools/AIStreamOutput";
import { eduApi } from "@/lib/api";

const SUBJECTS = ["语文", "数学", "英语", "物理", "化学", "历史", "政治", "生物", "地理", "体育", "其他"];
const GRADES = ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "初一", "初二", "初三", "高一", "高二", "高三"];
const DURATIONS = ["40分钟", "45分钟", "90分钟"];
const TEXTBOOKS = ["人教版", "北师大版", "苏教版", "沪教版", "通用版"];

export default function LessonPage() {
  const [form, setForm] = useState({
    subject: "语文",
    grade: "初一",
    topic: "",
    duration: "45分钟",
    objective: "",
    textbook: "人教版",
  });
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!form.topic.trim()) {
      alert("请填写课题名称");
      return;
    }
    setOutput("");
    setIsStreaming(true);

    try {
      const res = await eduApi.generateLesson({
        subject: form.subject,
        grade: form.grade,
        topic: form.topic,
        duration: form.duration,
        objective: form.objective || undefined,
        textbook: form.textbook,
      });
      // axios 拦截器已解包，res 直接是数据
      setOutput(typeof res === "string" ? res : JSON.stringify(res));
    } catch (err) {
      setOutput("生成失败，请检查网络或稍后重试。");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async (format: "word" | "pdf") => {
    // 简化版：直接下载文本
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.topic}-教案.${format === "word" ? "txt" : "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputPanel = (
    <div className="space-y-4">
      <h2 className="font-semibold text-gray-900">设置参数</h2>

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
          课题名称 <span className="text-red-500">*</span>
        </label>
        <input type="text" name="topic" value={form.topic} onChange={handleChange}
          placeholder="例：《背影》第一课时"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">课时时长</label>
          <select name="duration" value={form.duration} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
            {DURATIONS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">教材版本</label>
          <select name="textbook" value={form.textbook} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
            {TEXTBOOKS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          教学目标 <span className="text-gray-400 font-normal">(选填，AI可自动推断)</span>
        </label>
        <textarea name="objective" value={form.objective} onChange={handleChange}
          rows={3} placeholder="例：理解文章情感，学会分析人物描写手法..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
      </div>

      <button onClick={handleGenerate} disabled={isStreaming}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
        {isStreaming ? "⚡ 正在生成教案..." : "🚀 AI生成教案"}
      </button>

      <div className="text-xs text-gray-400 text-center">
        AI将生成完整教案框架，包含学情分析、教学流程等8个模块
      </div>
    </div>
  );

  const outputPanel = (
    <AIStreamOutput
      content={output}
      isStreaming={isStreaming}
      isEmpty={!output}
      emptyText="填写左侧课题信息，点击「AI生成教案」开始"
      onCopy={handleCopy}
      onSave={() => alert("保存成功")}
      onExport={handleExport}
      onRegenerate={handleGenerate}
    />
  );

  return (
    <ToolLayout
      title="AI备课助手"
      description="输入课题，5分钟生成完整教案"
      icon="📝"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
