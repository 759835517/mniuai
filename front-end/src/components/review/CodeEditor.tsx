"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-lg border border-[#30363D] bg-[#0D1117]">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#3B82F6] border-t-transparent" />
    </div>
  ),
});

interface MonacoEditorProps {
  value: string;
  language: string;
  height?: number | string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

export default function CodeEditor({
  value,
  language,
  height = 400,
  readOnly = false,
  onChange,
}: MonacoEditorProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#30363D]">
      <Editor
        height={height}
        language={language.toLowerCase()}
        value={value}
        theme="vs-dark"
        options={{
          readOnly,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
        }}
        onChange={(v) => onChange?.(v || "")}
      />
    </div>
  );
}
