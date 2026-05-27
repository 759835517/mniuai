"use client";

import { useState } from "react";
import CodeBlock from "@/components/shared/CodeBlock";
import EmptyState from "@/components/shared/EmptyState";

interface Template {
  filename: string;
  language: string;
  content: string;
}

interface CodeTemplateViewProps {
  templates: Template[];
}

export default function CodeTemplateView({ templates }: CodeTemplateViewProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!templates || templates.length === 0) {
    return <EmptyState title="暂无代码模板" description="项目的代码模板将在计划生成后显示" />;
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-[#30363D]">
        {templates.map((t, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
              activeIndex === i
                ? "border-[#3B82F6] text-[#3B82F6]"
                : "border-transparent text-[#8B949E] hover:text-[#F0F6FC]"
            }`}
          >
            {t.filename}
          </button>
        ))}
      </div>

      {/* Code */}
      {templates[activeIndex] && (
        <CodeBlock
          code={templates[activeIndex].content}
          language={templates[activeIndex].language}
          className="font-mono"
        />
      )}
    </div>
  );
}
