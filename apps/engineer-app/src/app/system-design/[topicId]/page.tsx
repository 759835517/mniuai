"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { engineerApi } from "@/lib/api";
import ArchitectureWhiteboard from "@/components/whiteboard/ArchitectureWhiteboard";

const DEFAULT_STEPS = [
  { id: "clarify", name: "需求澄清", hint: "AI 会追问：用户规模？QPS？读写比？一致性要求？" },
  { id: "sketch", name: "架构草图", hint: "在白板绘制核心组件与数据流（集成 Excalidraw）" },
  { id: "tech", name: "技术选型", hint: "选择数据库、缓存、消息队列，并说明理由" },
  { id: "detail", name: "深入设计", hint: "数据模型、API 设计、扩展性与容错" },
  { id: "review", name: "AI 评估", hint: "AI 对合理性、扩展性、容错性打分并给出改进建议" },
];

export default function SystemDesignDetailPage() {
  const params = useParams();
  const topicId = params.topicId as string;

  const [activeStep, setActiveStep] = useState(0);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [topic, setTopic] = useState<{
    name: string;
    difficulty: string;
    tags: string[];
    description: string;
    steps: string[];
    completed: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    engineerApi
      .getSystemDesign(topicId)
      .then((res) => {
        setTopic({
          name: res.name,
          difficulty: res.difficulty,
          tags: res.tags,
          description: res.description,
          steps: res.steps,
          completed: res.completed,
        });
      })
      .catch(() => {
        setTopic({
          name: `系统设计：${topicId}`,
          difficulty: "中等",
          tags: ["综合"],
          description: "请根据题目要求完成系统设计。",
          steps: DEFAULT_STEPS.map((s) => s.name),
          completed: false,
        });
      })
      .finally(() => setLoading(false));
  }, [topicId]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">加载中…</div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">题目加载失败</div>
      </div>
    );
  }

  const steps = DEFAULT_STEPS;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link href="/system-design" className="text-sm text-gray-500 hover:text-blue-500">
          ← 返回题库
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-2">
          {topic.name}
        </h1>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">
            {topic.difficulty}
          </span>
          {topic.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600 mb-6">{topic.description}</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 步骤导航 */}
          <div className="lg:col-span-1 space-y-2">
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveStep(i)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                  activeStep === i
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <div className="text-xs text-gray-400 mb-1">步骤 {i + 1}</div>
                <div className="font-semibold text-gray-900 text-sm">{s.name}</div>
              </button>
            ))}
          </div>

          {/* 工作区 */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-2">{steps[activeStep].name}</h2>
              <p className="text-sm text-gray-500 mb-4">{steps[activeStep].hint}</p>

              {steps[activeStep].id === "sketch" ? (
                <Suspense fallback={<div className="border-2 border-dashed border-gray-300 rounded-xl h-96 flex items-center justify-center text-gray-400">加载白板中…</div>}>
                  <ArchitectureWhiteboard topicId={topicId} />
                </Suspense>
              ) : (
                <textarea
                  value={notes[steps[activeStep].id] || ""}
                  onChange={(e) =>
                    setNotes({ ...notes, [steps[activeStep].id]: e.target.value })
                  }
                  placeholder="在此记录你的设计思路…"
                  className="w-full h-64 border border-gray-200 rounded-xl p-4 text-sm focus:border-blue-400 focus:outline-none resize-none"
                />
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                disabled={activeStep === 0}
                className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 disabled:opacity-40"
              >
                上一步
              </button>
              {activeStep < steps.length - 1 ? (
                <button
                  onClick={() => setActiveStep((s) => s + 1)}
                  className="px-5 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600"
                >
                  下一步
                </button>
              ) : (
                <button className="px-5 py-2 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600">
                  提交 AI 评估
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
