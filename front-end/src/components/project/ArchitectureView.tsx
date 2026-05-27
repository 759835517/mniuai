"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";

interface ArchitectureViewProps {
  mermaidCode?: string;
}

export default function ArchitectureView({ mermaidCode }: ArchitectureViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!mermaidCode || !containerRef.current) return;
    setError(null);

    import("mermaid").then((mermaidModule) => {
      const mermaid = mermaidModule.default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
      });

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        const id = `mermaid-${Date.now()}`;
        mermaid
          .render(id, mermaidCode)
          .then(({ svg }) => {
            if (containerRef.current) {
              containerRef.current.innerHTML = svg;
            }
          })
          .catch((err: Error) => {
            setError(err.message || "渲染失败");
          });
      }
    });
  }, [mermaidCode]);

  const handleCopy = async () => {
    if (mermaidCode) {
      await navigator.clipboard.writeText(mermaidCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!mermaidCode) {
    return <EmptyState title="暂无架构图" description="项目的架构图将在计划生成后显示" />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[#30363D] bg-[#161B22] p-6">
        <p className="mb-3 text-sm text-red-400">架构图渲染失败</p>
        <pre className="overflow-auto rounded bg-[#0D1117] p-4 text-xs text-[#8B949E]">
          {mermaidCode}
        </pre>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#30363D] bg-[#161B22] p-6">
      <div className="mb-4 flex items-center justify-end gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[#8B949E] hover:bg-[#1C2128] hover:text-[#F0F6FC]"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "已复制" : "复制源码"}
        </button>
      </div>
      <div ref={containerRef} className="flex justify-center overflow-auto" />
    </div>
  );
}
