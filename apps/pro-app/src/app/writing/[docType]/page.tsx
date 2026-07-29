"use client";

import { useState } from "react";
import { proApi } from "@/lib/api";

const CONFIG: Record<string, {
  title: string;
  fields: { name: string; label: string; placeholder: string; textarea?: boolean }[];
}> = {
  prd: {
    title: "PRD 产品需求文档",
    fields: [
      { name: "name", label: "产品/功能名称", placeholder: "如：用户积分体系" },
      { name: "background", label: "背景与问题", placeholder: "描述当前问题和业务背景", textarea: true },
      { name: "goal", label: "产品目标", placeholder: "如：提升用户活跃度30%，增加复购率" },
      { name: "features", label: "核心功能（每行一个）", placeholder: "1. 积分获取规则\n2. 积分兑换商城\n3. 等级体系", textarea: true },
    ],
  },
  report: {
    title: "工作报告",
    fields: [
      { name: "period", label: "报告周期", placeholder: "如：2026年6月" },
      { name: "done", label: "本期完成工作", placeholder: "列出主要完成事项", textarea: true },
      { name: "data", label: "关键数据/成果", placeholder: "如：DAU增长15%，完成3个需求上线" },
      { name: "next", label: "下期计划", placeholder: "列出下期重点工作", textarea: true },
    ],
  },
  email: {
    title: "商务邮件",
    fields: [
      { name: "to", label: "收件人（角色）", placeholder: "如：合作方商务总监" },
      { name: "purpose", label: "邮件目的", placeholder: "如：邀请合作，洽谈代理协议" },
      { name: "keyInfo", label: "关键信息", placeholder: "核心诉求、时间安排、联系方式", textarea: true },
      { name: "tone", label: "语气风格", placeholder: "正式 / 友好 / 简洁" },
    ],
  },
  plan: {
    title: "项目方案",
    fields: [
      { name: "projectName", label: "项目名称", placeholder: "如：2026年Q3品牌推广项目" },
      { name: "objective", label: "项目目标", placeholder: "如：提升品牌知名度，获取5000条线索" },
      { name: "background", label: "项目背景", placeholder: "为什么要做这个项目", textarea: true },
      { name: "resources", label: "可用资源（预算/人力）", placeholder: "如：预算20万，2名运营，1名设计" },
      { name: "timeline", label: "时间安排", placeholder: "如：7月启动，9月底完成" },
    ],
  },
};

export default function WritingDocPage({ params }: { params: { docType: string } }) {
  const cfg = CONFIG[params.docType] || CONFIG.prd;
  const [fields, setFields] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    // 将表单字段拼接为内容
    const content = cfg.fields.map((f) => `${f.label}：${fields[f.name] || "未填写"}`).join("\n\n");
    if (!content.trim()) {
      alert("请至少填写一项内容");
      return;
    }
    setLoading(true);
    try {
      const res = await proApi.generateDocument({
        docType: cfg.title,
        content,
      });
      // axios 拦截器已解包，res 直接是数据
      setOutput((res as any)?.content || "");
    } catch {
      alert("生成失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{cfg.title}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧表单 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">填写核心信息</h2>
            <div className="space-y-4">
              {cfg.fields.map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  {f.textarea ? (
                    <textarea
                      value={fields[f.name] || ""}
                      onChange={(e) => setFields({ ...fields, [f.name]: e.target.value })}
                      placeholder={f.placeholder}
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  ) : (
                    <input
                      type="text"
                      value={fields[f.name] || ""}
                      onChange={(e) => setFields({ ...fields, [f.name]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? "AI生成中..." : "生成文档"}
            </button>
          </div>

          {/* 右侧输出 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">生成结果</h2>
              {output && (
                <button
                  onClick={handleCopy}
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
              <div className="h-80 flex items-center justify-center text-gray-300 text-sm border border-dashed border-gray-200 rounded-xl">
                填写左侧信息后点击"生成文档"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
