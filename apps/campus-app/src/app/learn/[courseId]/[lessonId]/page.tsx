"use client";

import { useState } from "react";
import Link from "next/link";

const LESSON = {
  courseId: "fullstack-w4",
  lessonId: "spring-boot-api",
  title: "RESTful API设计与实现",
  duration: "55分钟",
  videoUrl: "",
  transcript: "本节课我们将学习如何使用Spring Boot设计RESTful API...",
  nextLesson: { id: "spring-security-jwt", title: "JWT认证实现" },
  prevLesson: { id: "mybatis-crud", title: "MyBatis-Plus CRUD操作" },
};

export default function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const [tab, setTab] = useState<"video" | "notes" | "qa">("video");
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  async function handleAsk() {
    if (!question.trim() || asking) return;
    setAsking(true);
    setAiAnswer("");
    await new Promise((r) => setTimeout(r, 800));
    setAiAnswer(
      `关于你的问题"${question}"：\n\n在Spring Boot中，RESTful API的设计遵循HTTP语义。GET用于查询，POST用于创建，PUT/PATCH用于更新，DELETE用于删除。\n\n返回码约定：200成功、201创建成功、400参数错误、401未登录、403无权限、404资源不存在、500服务器错误。\n\n建议配合@Valid做入参校验，统一用ApiResponse<T>包装返回值。`
    );
    setQuestion("");
    setAsking(false);
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main: Video + Tabs */}
          <div className="flex-1 min-w-0">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden">
              {LESSON.videoUrl ? (
                <video className="w-full h-full" controls src={LESSON.videoUrl} />
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-3">▶️</div>
                  <div className="text-gray-400 text-sm">{LESSON.title}</div>
                  <div className="text-gray-500 text-xs mt-1">{LESSON.duration}</div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-800 rounded-xl p-1 mb-4">
              {(["video", "notes", "qa"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                    tab === t ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {t === "video" ? "课程内容" : t === "notes" ? "笔记" : "AI答疑"}
                </button>
              ))}
            </div>

            {tab === "video" && (
              <div className="bg-gray-800 rounded-xl p-5 text-sm text-gray-300 leading-relaxed">
                {LESSON.transcript}
              </div>
            )}
            {tab === "notes" && (
              <textarea
                className="w-full h-48 bg-gray-800 rounded-xl p-4 text-sm text-gray-200 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="在这里记录学习笔记..."
              />
            )}
            {tab === "qa" && (
              <div className="bg-gray-800 rounded-xl p-5">
                {aiAnswer && (
                  <div className="bg-gray-700 rounded-xl p-4 mb-4 text-sm text-gray-200 whitespace-pre-line">
                    <div className="text-blue-400 text-xs mb-2">🤖 AI助教</div>
                    {aiAnswer}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                    placeholder="对本节课有疑问？输入问题..."
                    className="flex-1 bg-gray-700 text-sm text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-gray-500"
                  />
                  <button
                    onClick={handleAsk}
                    disabled={!question.trim() || asking}
                    className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white text-sm font-semibold px-4 rounded-xl transition-colors"
                  >
                    {asking ? "..." : "问"}
                  </button>
                </div>
              </div>
            )}

            {/* Prev/Next */}
            <div className="flex justify-between mt-5">
              {LESSON.prevLesson && (
                <Link
                  href={`/learn/${params.courseId}/${LESSON.prevLesson.id}`}
                  className="text-sm text-gray-400 hover:text-gray-200 flex items-center gap-1"
                >
                  ← {LESSON.prevLesson.title}
                </Link>
              )}
              {LESSON.nextLesson && (
                <Link
                  href={`/learn/${params.courseId}/${LESSON.nextLesson.id}`}
                  className="ml-auto text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  {LESSON.nextLesson.title} →
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar: Outline */}
          <div className="w-72 shrink-0 bg-gray-800 rounded-2xl p-4 h-fit">
            <div className="font-semibold text-gray-200 mb-3 text-sm">课程目录</div>
            {[
              { id: "mybatis-crud", title: "MyBatis-Plus CRUD操作", done: true },
              { id: "spring-boot-api", title: "RESTful API设计", done: false, active: true },
              { id: "spring-security-jwt", title: "JWT认证实现", done: false },
              { id: "frontend-connect", title: "前后端联调", done: false },
            ].map((item) => (
              <Link
                key={item.id}
                href={`/learn/${params.courseId}/${item.id}`}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg mb-1 text-sm transition-colors ${
                  item.active
                    ? "bg-blue-500/20 text-blue-300"
                    : "hover:bg-gray-700 text-gray-400"
                }`}
              >
                <span className={`w-4 h-4 rounded-full border text-xs flex items-center justify-center shrink-0 ${
                  item.done ? "border-green-400 bg-green-400 text-white" : item.active ? "border-blue-400" : "border-gray-600"
                }`}>
                  {item.done ? "✓" : ""}
                </span>
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
