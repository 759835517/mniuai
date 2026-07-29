"use client";

import { useState, useCallback } from "react";
import { CodeEditor } from "./CodeEditor";
import { useCodeExecution } from "@/hooks/useCodeExecution";
import { LANGUAGE_OPTIONS } from "@/lib/api/sandbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Play, RotateCcw } from "lucide-react";

interface SandboxPanelProps {
  lessonId?: string;
  initialCode?: string;
}

/**
 * 代码沙盒面板：编辑器 + 语言选择 + 运行按钮 + 输出展示。
 */
export function SandboxPanel({ lessonId, initialCode }: SandboxPanelProps) {
  const [languageId, setLanguageId] = useState(71); // Python
  const [code, setCode] = useState(initialCode ?? LANGUAGE_OPTIONS[0]!.defaultCode);
  const [stdin, setStdin] = useState("");
  const { result, running, error, execute, reset } = useCodeExecution();

  const handleLanguageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = Number(e.target.value);
      setLanguageId(id);
      const lang = LANGUAGE_OPTIONS.find((l) => l.id === id);
      setCode(lang?.defaultCode ?? "");
      reset();
    },
    [reset]
  );

  const handleRun = useCallback(async () => {
    await execute({ languageId, sourceCode: code, stdin: stdin || undefined });
  }, [execute, languageId, code, stdin]);

  const statusColor = result
    ? result.status === "ACCEPTED"
      ? "text-green-400"
      : "text-red-400"
    : "text-[#8B949E]";

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex items-center gap-3">
        <select
          value={languageId}
          onChange={handleLanguageChange}
          className="rounded border border-[#30363D] bg-[#161B22] px-3 py-1.5 text-sm text-[#F0F6FC]"
        >
          {LANGUAGE_OPTIONS.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
        <Button
          onClick={handleRun}
          disabled={running}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          {running ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Play className="mr-1 h-3 w-3" />}
          运行
        </Button>
        <Button onClick={reset} variant="ghost" size="sm">
          <RotateCcw className="mr-1 h-3 w-3" />
          重置
        </Button>
      </div>

      {/* 编辑器 */}
      <CodeEditor value={code} onChange={setCode} />

      {/* 标准输入 */}
      <div>
        <label className="mb-1 block text-xs text-[#8B949E]">标准输入（可选）</label>
        <textarea
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          placeholder="输入程序需要的标准输入..."
          className="w-full rounded border border-[#30363D] bg-[#161B22] p-2 font-mono text-sm text-[#F0F6FC] placeholder:text-[#484F58]"
          rows={2}
        />
      </div>

      {/* 输出 */}
      <Card className="border-[#30363D] bg-[#0D1117] p-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-[#8B949E]">输出</span>
          {result && (
            <span className={`text-xs font-medium ${statusColor}`}>
              {result.status}
              {result.timeMs != null && ` · ${result.timeMs.toFixed(0)}ms`}
              {result.memoryKb != null && ` · ${result.memoryKb}KB`}
            </span>
          )}
        </div>
        <pre className="min-h-[60px] whitespace-pre-wrap font-mono text-sm text-[#F0F6FC]">
          {running ? "执行中..." : error ? `错误: ${error}` : result?.actualOutput || "点击「运行」执行代码"}
        </pre>
      </Card>
    </div>
  );
}
