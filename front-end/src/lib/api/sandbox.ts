import { apiClient } from "@/lib/utils/apiClient";
import type { ID } from "@/lib/types/api";

export interface CodeExecutionRequest {
  languageId: number;
  sourceCode: string;
  stdin?: string;
  expectedOutput?: string;
  lessonId?: ID;
  timeLimitSec?: number;
  memoryLimitMb?: number;
}

export interface CodeExecutionResult {
  submissionId: ID;
  status: string;
  actualOutput: string;
  timeMs: number | null;
  memoryKb: number | null;
}

export const sandboxApi = {
  execute(payload: CodeExecutionRequest): Promise<CodeExecutionResult> {
    return apiClient.post("/sandbox/execute", payload);
  },
  getSubmission(id: ID): Promise<CodeExecutionResult> {
    return apiClient.get(`/sandbox/submissions/${id}`);
  },
};

/** 常用语言的 Judge0 language_id 映射 */
export const LANGUAGE_OPTIONS = [
  { id: 71, name: "Python 3", defaultCode: 'print("Hello, World!")' },
  { id: 63, name: "JavaScript (Node.js)", defaultCode: 'console.log("Hello, World!");' },
  { id: 54, name: "C++ (GCC)", defaultCode: '#include <iostream>\nint main() {\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}' },
  { id: 62, name: "Java", defaultCode: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}' },
];
