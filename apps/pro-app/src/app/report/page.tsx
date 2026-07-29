"use client";

import { useState } from "react";

const TYPES = [
  { id: "weekly", label: "工作周报", icon: "📅" },
  { id: "monthly", label: "月度述职", icon: "📊" },
  { id: "ppt", label: "汇报PPT大纲", icon: "🖥️" },
];

const MOCK_OUTPUT: Record<string, string> = {
  weekly: `# 工作周报 · 第29周（7.21-7.25）

## 本周完成

**需求研发**
- 完成积分体系PRD并通过评审，预计8月1日上线
- 跟进用户反馈处理3项，修复率100%

**数据复盘**
- 周DAU均值：14.2万（环比+5.2%，目标达成率104%）
- 新用户7日留存：38.5%（高于历史均值3pp）

## 进行中

- [ ] Q3活动策划方案（预计本周五完成）
- [ ] 与研发沟通积分体系技术方案

## 下周计划

1. 积分体系技术方案确认并排期
2. 完成Q3活动策划方案初稿
3. 参与竞品分析讨论`,

  monthly: `# 月度述职 · 2026年6月

## 一、核心成果

| 指标 | 目标 | 实际 | 完成率 |
|---|---|---|---|
| DAU | 13万 | 13.8万 | 106% |
| 付费转化率 | 3.3% | 3.5% | 106% |
| 需求按时交付 | 90% | 100% | 111% |

## 二、重点工作回顾

**用户增长专项（亮点项目）**
- 主导6月增长活动，DAU从12万增长至13.8万
- 创新A/B测试方法，首页改版使转化率提升0.3pp

## 三、下月目标

- DAU目标：15万（+8.7%）
- 积分体系上线，预期提升复购率10%
- 启动Q3大促策划`,

  ppt: `# 汇报PPT大纲 · Q2业务回顾

## Slide 1 · 封面
Q2业务回顾与Q3展望 | 运营团队 | 2026-07-28

## Slide 2 · 核心结论（BLUF）
- Q2三大目标全部达成，超额完成率平均106%
- 关键突破：用户增长提速，留存创新高

## Slide 3 · Q2核心数据
[柱状图] DAU增长趋势：10万→13.8万
[折线图] 付费转化率走势：3.0%→3.5%

## Slide 4 · 亮点项目复盘
首页改版 A/B 测试
- 实验结论：大图Banner转化率比小图高23%
- 影响：全量推出后转化率持续+0.3pp

## Slide 5 · Q3目标规划
| 目标 | KPI | 关键举措 |
|---|---|---|
| 用户增长 | DAU 18万 | 积分体系+召回活动 |
| 商业化 | 付费转化4% | 订阅页改版 |`,
};

export default function ReportPage() {
  const [type, setType] = useState("weekly");
  const [content, setContent] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setOutput(MOCK_OUTPUT[type]);
    setLoading(false);
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI 汇报材料</h1>
        <p className="text-gray-500 mb-6">输入工作内容，AI生成专业汇报材料</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-3">选择类型</h2>
              <div className="grid grid-cols-3 gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-colors ${
                      type === t.id ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xl">{t.icon}</span>
                    <span className={`text-xs font-medium ${type === t.id ? "text-green-700" : "text-gray-600"}`}>
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <label className="block font-semibold text-gray-900 mb-2">本期工作内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="列出本期主要工作内容、关键数据和成果（格式不限）..."
                rows={8}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {loading ? "AI生成中..." : "生成汇报材料"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">生成结果</h2>
              {output && (
                <button
                  onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="text-sm text-green-600 hover:underline"
                >
                  {copied ? "已复制！" : "复制全文"}
                </button>
              )}
            </div>
            {output ? (
              <textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                className="w-full h-80 border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 font-mono"
              />
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-300 border border-dashed border-gray-200 rounded-xl text-sm">
                选择类型并输入内容后生成
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
