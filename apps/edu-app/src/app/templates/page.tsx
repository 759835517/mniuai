"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = ["全部", "教案模板", "试卷模板", "课件模板", "通知模板"];

const TEMPLATES = [
  { id: 1, title: "通用教案模板", category: "教案模板", icon: "📝", uses: 1203, tag: "官方精选" },
  { id: 2, title: "公开课教案模板", category: "教案模板", icon: "📝", uses: 856, tag: "官方精选" },
  { id: 3, title: "单元测验试卷", category: "试卷模板", icon: "📋", uses: 2341, tag: "热门" },
  { id: 4, title: "期中考试试卷", category: "试卷模板", icon: "📋", uses: 1876, tag: "" },
  { id: 5, title: "启发式课件", category: "课件模板", icon: "📊", uses: 643, tag: "" },
  { id: 6, title: "家长会通知", category: "通知模板", icon: "📢", uses: 1523, tag: "热门" },
  { id: 7, title: "作业提醒模板", category: "通知模板", icon: "📢", uses: 987, tag: "" },
  { id: 8, title: "微课教案模板", category: "教案模板", icon: "📝", uses: 432, tag: "" },
];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const filteredTemplates =
    selectedCategory === "全部"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">模板库</h1>
          <p className="text-gray-500">
            精选教案/试卷/课件/通知模板，10分钟完成一节课准备
          </p>
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                c === selectedCategory
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* 模板卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{template.icon}</span>
                {template.tag && (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-orange-100 text-orange-600">
                    {template.tag}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {template.title}
              </h3>
              <div className="text-xs text-gray-400 mb-4">
                {template.uses.toLocaleString()} 次使用
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-600 text-sm font-medium py-2 rounded-lg transition-colors">
                  预览
                </button>
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                  使用
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">📭</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              该分类暂无模板
            </h3>
            <p className="text-gray-500">请选择其他分类查看</p>
          </div>
        )}
      </div>
    </div>
  );
}
