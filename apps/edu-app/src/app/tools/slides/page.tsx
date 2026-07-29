"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { eduApi } from "@/lib/api";

const STYLES = ["简约", "活泼", "学术"];
const SUBJECTS = ["语文", "数学", "英语", "物理", "化学", "历史", "通用"];
const GRADES = ["小学", "初中", "高中", "大学"];

export default function SlidesPage() {
  const [form, setForm] = useState({
    topic: "",
    subject: "语文",
    grade: "初中",
    duration: "45分钟",
    style: "简约",
  });
  const [slides, setSlides] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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
    setSlides([]);
    setIsGenerating(true);

    try {
      const res = await eduApi.generateSlides({
        subject: form.subject,
        grade: form.grade,
        topic: form.topic,
        duration: form.duration,
        style: form.style,
      });
      // axios 拦截器已解包，res 直接是数据
      setSlides((res as any)?.slides || []);
    } catch {
      alert("生成失败，请稍后重试");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const text = slides.map((s: any) =>
        `第${s.pageNumber}页：${s.title}\n${s.content}\n备注：${s.notes || "—"}`
      ).join("\n\n---\n\n");
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${form.topic}-课件.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("导出失败，请稍后重试");
    } finally {
      setIsExporting(false);
    }
  };

  const inputPanel = (
    <div className="space-y-4">
      <h2 className="font-semibold text-gray-900">设置课件参数</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          课题名称 <span className="text-red-500">*</span>
        </label>
        <input type="text" name="topic" value={form.topic} onChange={handleChange}
          placeholder="例：光合作用"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">学科</label>
          <select name="subject" value={form.subject} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">学段</label>
          <select name="grade" value={form.grade} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
            {GRADES.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">PPT风格</label>
        <div className="flex gap-2">
          {STYLES.map((s) => (
            <button key={s} onClick={() => setForm((p) => ({ ...p, style: s }))}
              className={`flex-1 py-2 text-sm rounded-xl border transition-colors ${
                form.style === s
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleGenerate} disabled={isGenerating}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors">
        {isGenerating ? "⚡ 正在生成课件..." : "🚀 AI生成课件结构"}
      </button>

      {slides.length > 0 && (
        <button onClick={handleExport} disabled={isExporting}
          className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-3 rounded-xl transition-colors">
          {isExporting ? "导出中..." : "📤 导出课件"}
        </button>
      )}
    </div>
  );

  const outputPanel = (
    <div>
      {slides.length === 0 && !isGenerating ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-gray-400 text-sm">填写课题后点击生成，预览每一页幻灯片</p>
        </div>
      ) : isGenerating ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="flex gap-1 mb-4">
            {[0, 150, 300].map((delay) => (
              <span key={delay} style={{ animationDelay: `${delay}ms` }}
                className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" />
            ))}
          </div>
          <p className="text-gray-500">AI正在构建课件结构...</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">课件预览（{slides.length}页）</h3>
          </div>
          {slides.map((slide: any) => (
            <div key={slide.pageNumber} className="border border-gray-100 rounded-xl p-4 hover:border-orange-200 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-white bg-gray-400 w-6 h-6 rounded-full flex items-center justify-center">
                  {slide.pageNumber}
                </span>
                <span className="font-medium text-gray-900 text-sm">{slide.title}</span>
              </div>
              <ul className="space-y-1">
                {slide.content?.split("\n").filter((l: string) => l.trim()).map((line: string, i: number) => (
                  <li key={i} className="text-xs text-gray-500 flex items-start gap-1">
                    <span className="text-orange-400 mt-0.5">•</span>
                    {line.replace(/^•\s*/, "")}
                  </li>
                ))}
              </ul>
              {slide.notes && (
                <div className="mt-2 text-xs text-blue-500 bg-blue-50 rounded-lg px-2 py-1">
                  📝 {slide.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <ToolLayout
      title="AI课件生成"
      description="输入课题，一键生成可下载的PPTX课件"
      icon="📊"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
