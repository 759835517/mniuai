"use client";

import { useState, useCallback } from "react";
import { sandboxApi, type CodeExecutionResult } from "@/lib/api/sandbox";

interface CodeExecutionState {
  result: CodeExecutionResult | null;
  running: boolean;
  error: string | null;
}

/**
 * 代码执行 hook。
 * 封装 sandboxApi.execute，管理运行状态和结果。
 */
export function useCodeExecution() {
  const [state, setState] = useState<CodeExecutionState>({
    result: null,
    running: false,
    error: null,
  });

  const execute = useCallback(async (payload: {
    languageId: number;
    sourceCode: string;
    stdin?: string;
    expectedOutput?: string;
  }) => {
    setState({ result: null, running: true, error: null });
    try {
      const result = await sandboxApi.execute(payload);
      setState({ result, running: false, error: null });
      return result;
    } catch (e) {
      const message = (e as Error).message || "执行失败";
      setState({ result: null, running: false, error: message });
      throw e;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ result: null, running: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
