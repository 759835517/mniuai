"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { engineerApi } from "@/lib/api";

const TYPES = ["全部", "Bug修复", "功能开发", "代码重构", "单元测试", "性能优化"];

const DIFF_COLOR: Record<string, string> = {
  简单: "text-green-600 bg-green-50",
  中等: "text-orange-600 bg-orange-50",
  困难: "text-red-600 bg-red-50",
};

export default function PracticePage() {
  const [type, setType] = useState("全部");
  const [tasks, setTasks] = useState<
    { id: string; title: string; type: string; difficulty: string; lang: string; duration: string; desc: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    engineerApi
      .listTasks()
      .then((res) => setTasks(res))
      .catch(() => {
        setTasks([
          { id: "bugfix-1", title: "修复用户登录接口的空指针异常", type: "Bug修复", difficulty: "简单", lang: "Java", duration: "30分钟", desc: "定位并修复 AuthController 中的 NPE，补全边界判断" },
          { id: "feature-1", title: "实现商品搜索的分页与筛选", type: "功能开发", difficulty: "中等", lang: "TypeScript", duration: "60分钟", desc: "根据需求文档补全搜索 API，支持分页、价格区间筛选" },
          { id: "refactor-1", title: "重构订单状态机的 if-else 地狱", type: "代码重构", difficulty: "中等", lang: "Java", duration: "45分钟", desc: "将嵌套条件重构为状态模式，提升可读性和扩展性" },
          { id: "test-1", title: "为购物车服务补充单元测试", type: "单元测试", difficulty: "简单", lang: "TypeScript", duration: "40分钟", desc: "覆盖增删改查与边界场景，目标覆盖率 80%+" },
          { id: "perf-1", title: "优化订单列表的 N+1 查询", type: "性能优化", difficulty: "困难", lang: "Java", duration: "50分钟", desc: "分析慢查询，改为批量查询 + 缓存，接口耗时降至 200ms 内" },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = tasks.filter((t) => type === "全部" || t.type === type);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <section className="py-10 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-2">AI 编程实战</h1>
          <p className="text-gray-300 text-sm max-w-2xl">
            在真实代码库中完成 Bug 修复、功能开发、重构等任务，AI 全程辅助，
            像使用 Cursor 一样高效编码，按功能正确性、代码质量、性能综合评分。
          </p>
        </div>
      </section>

      <section className="py-6 bg-white border-b border-gray-100 sticky top-16 z-10">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-2 flex-wrap">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                type === t
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="py-6">
        <div className="max-w-5xl mx-auto px-4">
          {loading ? (
            <div className="py-12 text-center text-gray-400 text-sm">加载中…</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((task) => (
                <Link
                  key={task.id}
                  href={`/practice/${task.id}`}
                  className="bg-white rounded-2xl border-2 border-gray-100 p-5 hover:border-orange-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {task.type}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${DIFF_COLOR[task.difficulty]}`}
                    >
                      {task.difficulty}
                    </span>
                    <span className="ml-auto text-xs text-gray-400">{task.lang}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{task.desc}</p>
                  <div className="text-xs text-gray-400">⏱ 预计 {task.duration}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
