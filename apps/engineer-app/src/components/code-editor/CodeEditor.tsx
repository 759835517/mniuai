"use client";

import { useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

interface Props {
  value: string;
  onChange: (value: string) => void;
  language: string;
  theme?: "vs-dark" | "light";
  readOnly?: boolean;
  height?: string;
}

export function CodeEditor({
  value,
  onChange,
  language,
  theme = "vs-dark",
  readOnly = false,
  height = "100%",
}: Props) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const monacoLanguage = language.toLowerCase().replace("python3", "python").replace("javascript", "javascript").replace("typescript", "typescript").replace("c++", "cpp");

  return (
    <Editor
      height={height}
      language={monacoLanguage}
      value={value}
      theme={theme}
      onChange={(v) => onChange(v || "")}
      onMount={handleEditorDidMount}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        wordWrap: "on",
        readOnly,
        padding: { top: 12 },
        renderLineHighlight: "all",
        smoothScrolling: true,
        cursorBlinking: "smooth",
      }}
    />
  );
}
