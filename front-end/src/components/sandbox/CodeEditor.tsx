"use client";

import Editor, { type OnMount } from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

/**
 * Monaco Editor 代码编辑器封装。
 */
export function CodeEditor({ value, onChange, language = "python", readOnly = false }: CodeEditorProps) {
  const handleMount: OnMount = (editor, monaco) => {
    // 可选：配置编辑器主题或快捷键
    monaco.editor.defineTheme("mniuai-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: { "editor.background": "#161B22" },
    });
    monaco.editor.setTheme("mniuai-dark");
  };

  return (
    <div className="overflow-hidden rounded border border-[#30363D]">
      <Editor
        height="300px"
        language={language}
        value={value}
        onChange={(v) => onChange(v ?? "")}
        onMount={handleMount}
        theme="mniuai-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
