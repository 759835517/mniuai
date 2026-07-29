"use client";

import { ReactNode } from "react";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: string;
  inputPanel: ReactNode;
  outputPanel: ReactNode;
}

export function ToolLayout({
  title,
  description,
  icon,
  inputPanel,
  outputPanel,
}: ToolLayoutProps) {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h1 className="font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>

      {/* 左右分栏 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* 左侧：参数输入 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            {inputPanel}
          </div>

          {/* 右侧：AI生成结果 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-h-[500px]">
            {outputPanel}
          </div>
        </div>
      </div>
    </div>
  );
}
