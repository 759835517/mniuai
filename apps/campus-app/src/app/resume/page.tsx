"use client";

import { useState } from "react";

const TEMPLATES = [
  { id: "campus", name: "大学生简历", icon: "🎓" },
  { id: "intern", name: "实习申请", icon: "💼" },
  { id: "fullstack", name: "全栈工程师", icon: "💻" },
];

export default function ResumePage() {
  const [template, setTemplate] = useState("campus");
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    name: "", school: "", major: "", grad: "2026-06",
    email: "", phone: "", github: "",
    bio: "", skills: "", projects: "", experience: "",
  });

  function handleChange(key: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleGenerate() {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setGenerating(false);
    alert("简历已生成，可下载PDF或复制Markdown版本");
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI简历生成器</h1>
            <p className="text-gray-500 text-sm mt-1">填写信息，AI帮你优化措辞，生成专业简历</p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Form */}
          <div className="flex-1 space-y-5">
            {/* Template Selection */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="text-sm font-semibold text-gray-700 mb-3">选择模板</div>
              <div className="flex gap-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                      template === t.id
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-100 text-gray-600 hover:border-blue-200"
                    }`}
                  >
                    <span>{t.icon}</span>{t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="text-sm font-semibold text-gray-700 mb-4">基本信息</div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "name", label: "姓名", placeholder: "张同学" },
                  { key: "school", label: "学校", placeholder: "某某大学" },
                  { key: "major", label: "专业", placeholder: "计算机科学与技术" },
                  { key: "grad", label: "毕业时间", placeholder: "2026-06" },
                  { key: "email", label: "邮箱", placeholder: "your@email.com" },
                  { key: "phone", label: "手机", placeholder: "138xxxx0000" },
                  { key: "github", label: "GitHub", placeholder: "github.com/username" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
                    <input
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => handleChange(field.key as keyof typeof form, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Projects */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-4">
              <div className="text-sm font-semibold text-gray-700 mb-1">技能与项目</div>
              {[
                { key: "skills", label: "技能清单", placeholder: "React, TypeScript, Spring Boot, MySQL, Docker..." },
                { key: "projects", label: "项目经历（AI帮你优化描述）", placeholder: "项目名称：...\n主要工作：...\n技术亮点：..." },
                { key: "bio", label: "个人简介（可选，AI优化）", placeholder: "热爱编程..." },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
                  <textarea
                    rows={field.key === "bio" ? 2 : 4}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => handleChange(field.key as keyof typeof form, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-300"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !form.name}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              {generating ? "AI生成中..." : "🤖 AI生成简历"}
            </button>
          </div>

          {/* Preview (placeholder) */}
          <div className="w-80 shrink-0 bg-white rounded-2xl border border-gray-100 p-6 h-fit">
            <div className="text-sm font-semibold text-gray-700 mb-4">简历预览</div>
            <div className="aspect-[3/4] bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-3xl mb-2">📄</div>
                <div className="text-xs">填写信息后点击生成</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
