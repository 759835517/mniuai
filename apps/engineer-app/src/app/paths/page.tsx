"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { engineerApi } from "@/lib/api";

export default function PathsPage() {
  const [paths, setPaths] = useState<
    { id: string; name: string; duration: string; level: string; icon: string; desc: string; modules: string[]; popular: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    engineerApi
      .listPaths()
      .then((res) => setPaths(res))
      .catch(() => {
        setPaths([
          { id: "junior", name: "初级进阶路径", duration: "8周", level: "L1→L2", icon: "🌱", desc: "夯实算法与工程基础，突破1~3年工程师技术瓶颈", modules: ["算法基础100题", "AI编程实战", "Git工作流", "单元测试"], popular: false },
          { id: "senior", name: "中高级路径", duration: "12周", level: "L2→L3", icon: "🚀", desc: "掌握系统设计与高并发，冲刺大厂中高级岗位", modules: ["算法进阶250题", "系统设计7大专题", "AI面试官陪练", "代码审查"], popular: true },
          { id: "interview-sprint", name: "面试冲刺路径", duration: "4周", level: "冲刺", icon: "🎯", desc: "1个月密集训练，面试前快速提分", modules: ["高频面试题", "大厂真题集", "20轮模拟面试", "简历优化"], popular: false },
          { id: "architect", name: "架构师路径", duration: "16周", level: "L3→L4", icon: "🏛️", desc: "系统设计深度进阶，面向技术专家与架构师", modules: ["分布式系统", "高可用架构", "复杂系统设计", "技术方案评审"], popular: false },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">选择学习路径</h1>
          <p className="text-gray-500">
            根据你的目标和当前水平，选择最合适的成长路线
          </p>
          <Link
            href="/assessment"
            className="inline-block mt-6 text-orange-500 hover:text-orange-600 text-sm underline"
          >
            不确定？先做能力诊断测评 →
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          {loading ? (
            <div className="py-12 text-center text-gray-400 text-sm">加载中…</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {paths.map((path) => (
                <Link
                  key={path.id}
                  href={`/paths/${path.id}`}
                  className="relative bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all"
                >
                  {path.popular && (
                    <span className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full bg-orange-500 text-white">
                      最热门
                    </span>
                  )}
                  <div className="text-4xl mb-4">{path.icon}</div>
                  <h3 className="font-bold text-gray-900 text-xl mb-2">
                    {path.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{path.desc}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span>⏱ {path.duration}</span>
                    <span>📈 {path.level}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {path.modules.map((m) => (
                      <span
                        key={m}
                        className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
