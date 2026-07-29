"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

interface GradeResult {
  studentName: string;
  score: number;
  feedback: string;
  confidence: number;
}

export default function GradePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [standardAnswer, setStandardAnswer] = useState("");
  const [subject, setSubject] = useState("数学");
  const [results, setResults] = useState<GradeResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemoveFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleGrade = async () => {
    if (files.length < 5) {
      alert("请至少上传5份作业才能触发批量批改");
      return;
    }
    setIsProcessing(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      formData.append("standardAnswer", standardAnswer);
      formData.append("subject", subject);

      const res = await fetch("/api/v1/edu/grade/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      alert("批改失败，请稍后重试");
    } finally {
      setIsProcessing(false);
    }
  };

  const inputPanel = (
    <div className="space-y-4">
      <h2 className="font-semibold text-gray-900">上传作业</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">学科</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
          {["语文", "数学", "英语", "物理", "化学"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* 拖拽上传区 */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragOver ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
        }`}
      >
        <div className="text-3xl mb-2">📄</div>
        <p className="text-sm font-medium text-gray-700 mb-1">拖拽或点击上传作业图片</p>
        <p className="text-xs text-gray-400">支持 JPG / PNG，建议图片清晰、光线充足</p>
        <input ref={fileInputRef} type="file" multiple accept="image/*"
          onChange={handleFileSelect} className="hidden" />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">已选 {files.length} 份</div>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                <span className="truncate">{f.name}</span>
                <button onClick={() => handleRemoveFile(i)} className="text-red-400 hover:text-red-600 ml-2">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">参考答案（客观题用）</label>
        <textarea value={standardAnswer} onChange={(e) => setStandardAnswer(e.target.value)}
          rows={3} placeholder="客观题答案：1.A  2.B  3.C ... (主观题可留空，AI将评估完整性)"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
      </div>

      <button onClick={handleGrade} disabled={isProcessing || files.length === 0}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors">
        {isProcessing ? "⚡ AI批改中..." : `🚀 开始批改（${files.length}份）`}
      </button>
      <p className="text-xs text-gray-400 text-center">
        OCR识别 + AI评分，低置信度结果会标记，需人工复核
      </p>
    </div>
  );

  const outputPanel = (
    <div>
      {results.length === 0 && !isProcessing ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-gray-400 text-sm">上传作业图片后点击开始批改</p>
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
          <p className="text-gray-500">OCR识别 + AI批改中，请稍候...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">批改结果（{results.length}份）</h3>
            <button className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-300">
              📤 导出成绩单
            </button>
          </div>
          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{r.studentName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-orange-500">{r.score}分</span>
                    {r.confidence < 0.8 && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                        需人工复核
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{r.feedback}</p>
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
      description="上传作业图片，AI自动批改评分，人工复核确认"
      icon="✅"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
