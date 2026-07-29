"use client";

import { useState } from "react";

const QUESTIONS = [
  { id: 1, dim: "文档写作", q: "你通常需要多久写完一份完整的PRD或方案？", opts: ["1小时以内", "1-3小时", "3-6小时", "6小时以上"] },
  { id: 2, dim: "文档写作", q: "你在写文档时最大的障碍是什么？", opts: ["不知道如何开头", "内容组织混乱", "表达不够专业", "花时间但质量低"] },
  { id: 3, dim: "数据分析", q: "你处理数据报告的方式是？", opts: ["自己用Excel做", "找数据同学帮忙", "外包分析", "基本不做数据分析"] },
  { id: 4, dim: "数据分析", q: "你能独立完成数据可视化吗？", opts: ["熟练", "基本可以", "需要帮助", "完全不会"] },
  { id: 5, dim: "沟通汇报", q: "你整理会议纪要一般需要多长时间？", opts: ["15分钟以内", "15-30分钟", "30-60分钟", "超过1小时"] },
  { id: 6, dim: "沟通汇报", q: "你在汇报时最常遇到什么问题？", opts: ["数据找不到", "表达不清晰", "太啰嗦", "时间来不及准备"] },
  { id: 7, dim: "项目管理", q: "你如何管理日常工作任务？", opts: ["工具（飞书/钉钉等）", "Excel表格", "便签/手写", "基本靠记忆"] },
  { id: 8, dim: "项目管理", q: "你的工作计划通常能完成多少？", opts: ["90%以上", "70-90%", "50-70%", "50%以下"] },
  { id: 9, dim: "AI工具", q: "你目前使用AI工具的频率？", opts: ["每天使用", "每周使用", "偶尔使用", "几乎不用"] },
  { id: 10, dim: "AI工具", q: "你用AI工具做过哪类工作？", opts: ["写作/文案", "代码/技术", "数据分析", "没用过"] },
];

const DIMS = ["文档写作", "数据分析", "沟通汇报", "项目管理", "AI工具"];

function calcScore(answers: Record<number, number>) {
  const dimScores: Record<string, number> = {};
  DIMS.forEach((d) => { dimScores[d] = 0; });
  QUESTIONS.forEach((q) => {
    const ans = answers[q.id] ?? 0;
    dimScores[q.dim] = (dimScores[q.dim] || 0) + (3 - ans) * 25;
  });
  return dimScores;
}

export default function AssessmentPage() {
  const [phase, setPhase] = useState<"start" | "quiz" | "result">("start");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  function handleAnswer(idx: number) {
    const q = QUESTIONS[current];
    const next = { ...answers, [q.id]: idx };
    setAnswers(next);
    if (current + 1 < QUESTIONS.length) {
      setCurrent(current + 1);
    } else {
      setPhase("result");
    }
  }

  if (phase === "start") {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">职业能力诊断</h1>
          <p className="text-gray-500 mb-6">
            10道题，约3分钟，了解你在5个职场维度的AI效率短板，获取个性化工具推荐。
          </p>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6 text-left space-y-2">
            {DIMS.map((d) => (
              <div key={d} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                {d}
              </div>
            ))}
          </div>
          <button
            onClick={() => setPhase("quiz")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-10 py-3 rounded-full transition-colors"
          >
            开始诊断
          </button>
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    const q = QUESTIONS[current];
    const pct = Math.round(((current) / QUESTIONS.length) * 100);
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{current + 1} / {QUESTIONS.length}</span>
              <span>{q.dim}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">{q.q}</h2>
            <div className="space-y-3">
              {q.opts.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-green-400 hover:bg-green-50 text-sm text-gray-700 transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const scores = calcScore(answers);
  const level = Object.values(scores).reduce((a, b) => a + b, 0) / DIMS.length;
  const levelLabel = level >= 75 ? "AI高手" : level >= 55 ? "AI达人" : level >= 35 ? "AI提效型" : "AI萌新";

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">诊断完成</h2>
          <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
            能力等级：{levelLabel}
          </span>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">能力地图</h3>
          <div className="space-y-3">
            {DIMS.map((d) => (
              <div key={d}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{d}</span>
                  <span className="font-semibold text-gray-900">{scores[d]}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${scores[d]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-green-50 rounded-2xl p-5 border border-green-100 mb-6">
          <h3 className="font-semibold text-green-800 mb-2">推荐优先使用</h3>
          <p className="text-sm text-green-700">根据你的诊断结果，建议从 <strong>AI文档写作</strong> 和 <strong>AI会议纪要</strong> 开始，提升最明显的工作场景。</p>
        </div>
        <div className="flex gap-3">
          <a href="/tools" className="flex-1 text-center bg-green-600 text-white font-semibold py-3 rounded-full hover:bg-green-700 transition-colors">
            开始使用工具
          </a>
          <button onClick={() => { setPhase("start"); setCurrent(0); setAnswers({}); }} className="flex-1 text-center border border-gray-300 text-gray-700 font-semibold py-3 rounded-full hover:border-green-400 transition-colors">
            重新诊断
          </button>
        </div>
      </div>
    </div>
  );
}
