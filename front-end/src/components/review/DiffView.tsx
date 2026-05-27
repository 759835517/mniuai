"use client";

import dynamic from "next/dynamic";

const DiffEditor = dynamic(() => import("@monaco-editor/react").then((mod) => mod.DiffEditor), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] items-center justify-center rounded-lg border border-[#30363D] bg-[#0D1117]">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#3B82F6] border-t-transparent" />
    </div>
  ),
});

interface DiffViewProps {
  original: string;
  modified: string;
  language: string;
  height?: number | string;
}

export default function DiffView({ original, modified, language, height = 300 }: DiffViewProps) {
  if (!original && !modified) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-[#30363D]">
      <DiffEditor
        height={height}
        language={language.toLowerCase()}
        original={original}
        modified={modified}
        theme="vs-dark"
        options={{
          readOnly: true,
          renderSideBySide: false,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      />
    </div>
  );
}
