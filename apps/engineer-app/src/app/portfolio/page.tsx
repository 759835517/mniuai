"use client";

import { useState } from "react";

const PROJECTS = [
  {
    id: "p1",
    title: "高并发短链服务",
    desc: "基于 Redis + 雪花算法实现，QPS 5000+，含限流与统计。",
    tags: ["Go", "Redis", "系统设计"],
    from: "系统设计练习",
  },
  {
    id: "p2",
    title: "订单系统重构",
    desc: "将单体订单模块拆分为领域服务，接口 P99 从 800ms 降至 120ms。",
    tags: ["Java", "重构", "性能优化"],
    from: "AI编程实战",
  },
];

export default function PortfolioPage() {
  const [projects] = useState(PROJECTS);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">我的作品集</h1>
            <p className="text-gray-500 text-sm mt-1">
              沉淀实战与系统设计成果，一键生成面试作品集链接。
            </p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-full text-sm">
            + 添加项目
          </button>
        </div>

        <div className="space-y-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-gray-900 text-lg">{p.title}</h3>
                <span className="text-xs text-gray-400 bg-gray-50 rounded-full px-3 py-1">
                  来自 {p.from}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2 mb-4">{p.desc}</p>
              <div className="flex gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-blue-50 text-blue-600 rounded-full px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
