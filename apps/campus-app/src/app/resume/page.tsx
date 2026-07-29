"use client";

import { useState } from "react";
import { campusApi } from "@/lib/api";
import type { ResumeResponse } from "@mniuai/api-client";

const TEMPLATES = [
  { id: "campus", name: "大学生简历", icon: "🎓" },
  { id: "intern", name: "实习申请", icon: "💼" },
  { id: "fullstack", name: "全栈工程师", icon: "💻" },
];

export default function ResumePage() {
  const [template, setTemplate] = useState("campus");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<ResumeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", school: "", major: "", grad: "2026-06",
    email: "", phone: "", github: "",
    bio: "", skills: "", projects: "", experience: "",
  });

  function handleChange(key: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleGenerate() {
    if (!form.name.trim()) {
      setError("请填写姓名");
      return;
    }

    setGenerating(true);
    setError(null);
    setResult(null);

    try {
      // 解析技能清单
      const skills = form.skills
        .split(/[,，、\n]/)
        .map((s) => s.trim())
        .filter(Boolean);

      // 解析项目经历
      const projects = form.projects
        .split(/\n\n|\n---\n/)
        .filter(Boolean)
        .map((p) => ({
          name: p.split("\n")[0]?.replace(/^[-*]\s*/, "").trim() || "项目",
          description: p.split("\n").slice(1).join("\n").trim(),
          techStack: [] as string[],
        }));

      // 解析工作经历
      const experiences = form.experience
        .split(/\n/)
        .map((e) => e.replace(/^[-*]\s*/, "").trim())
        .filter(Boolean);

      const response = await campusApi.generateResume({
        name: form.name,
        school: form.school || undefined,
        major: form.major || undefined,
        graduationDate: form.grad || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        github: form.github || undefined,
        bio: form.bio || undefined,
        skills: skills.length > 0 ? skills : undefined,
        projects: projects.length > 0 ? projects : undefined,
        experiences: experiences.length > 0 ? experiences : undefined,
      });

      setResult(response);
    } catch (err) {
      console.error("Failed to generate resume:", err);
      setError("生成简历失败，请检查登录状态或稍后重试");
    } finally {
      setGenerating(false);
    }
  }

  function copyToClipboard() {
    if (result?.markdownContent) {
      navigator.clipboard.writeText(result.markdownContent);
      alert("简历内容已复制到剪贴板");
    }
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
                { key: "skills", label: "技能清单（用逗号分隔）", placeholder: "React, TypeScript, Spring Boot, MySQL, Docker..." },
                { key: "projects", label: "项目经历（AI帮你优化描述）", placeholder: "项目名称：校园二手交易平台\n主要工作：负责后端API开发\n技术亮点：使用WebSocket实现实时聊天" },
                { key: "experience", label: "实习/工作经历（每行一条）", placeholder: "XX公司 - 后端开发实习生 - 2025.06~2025.09" },
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

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating || !form.name}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              {generating ? "AI生成中..." : "🤖 AI生成简历"}
            </button>
          </div>

          {/* Preview */}
          <div className="w-96 shrink-0 bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-gray-700">简历预览</div>
              {result && (
                <button
                  onClick={copyToClipboard}
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  复制 Markdown
                </button>
              )}
            </div>
            {generating ? (
              <div className="aspect-[3/4] bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                  <div className="text-xs">AI 正在生成简历...</div>
                </div>
              </div>
            ) : result ? (
              <div className="aspect-[3/4] bg-gray-50 rounded-xl border border-gray-200 overflow-y-auto">
                <pre className="p-4 text-xs text-gray-700 whitespace-pre-wrap font-mono">
                  {result.markdownContent}
                </pre>
              </div>
            ) : (
              <div className="aspect-[3/4] bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-3xl mb-2">📄</div>
                  <div className="text-xs">填写信息后点击生成</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
