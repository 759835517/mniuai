"use client";

import { SandboxPanel } from "@/components/sandbox/SandboxPanel";
import { Card } from "@/components/ui/card";

/**
 * 代码沙盒页面。
 * 提供在线代码编辑和执行环境（基于 Judge0）。
 */
export default function SandboxPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">代码沙盒</h1>
        <p className="mt-1 text-sm text-[#8B949E]">在线编写和运行代码，支持 Python、JavaScript、C++、Java</p>
      </div>

      <Card className="border-[#30363D] bg-[#161B22] p-4">
        <SandboxPanel />
      </Card>

      <Card className="border-[#30363D] bg-[#161B22] p-4">
        <h3 className="mb-2 text-sm font-medium text-[#F0F6FC]">使用说明</h3>
        <ul className="space-y-1 text-xs text-[#8B949E]">
          <li>• 选择编程语言，在编辑器中编写代码</li>
          <li>• 如需标准输入，在输入框中填写</li>
          <li>• 点击「运行」提交代码到沙盒执行</li>
          <li>• 执行时间限制 5 秒，内存限制 256 MB</li>
        </ul>
      </Card>
    </div>
  );
}
