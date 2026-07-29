import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "编程练习",
  description: "500道精选编程题，AI逐级提示，真实沙盒执行",
};

const CATEGORIES = ["全部", "算法基础", "数据结构", "数据库SQL", "前端", "后端Java", "系统设计"];

const PROBLEMS = [
  { id: "1", title: "两数之和", difficulty: "简单", category: "算法基础", solved: true, acceptance: "72%" },
  { id: "2", title: "反转链表", difficulty: "简单", category: "数据结构", solved: true, acceptance: "68%" },
  { id: "3", title: "二叉树层序遍历", difficulty: "中等", category: "数据结构", solved: false, acceptance: "55%" },
  { id: "4", title: "查询每个部门最高薪资", difficulty: "中等", category: "数据库SQL", solved: false, acceptance: "61%" },
  { id: "5", title: "实现Promise.all", difficulty: "中等", category: "前端", solved: false, acceptance: "48%" },
  { id: "6", title: "手写Spring IoC容器", difficulty: "困难", category: "后端Java", solved: false, acceptance: "32%" },
  { id: "7", title: "设计短链接系统", difficulty: "困难", category: "系统设计", solved: false, acceptance: "40%" },
  { id: "8", title: "合并K个升序链表", difficulty: "困难", category: "数据结构", solved: false, acceptance: "38%" },
];

const DIFF_COLOR: Record<string, string> = {
  简单: "text-green-600 bg-green-50",
  中等: "text-yellow-600 bg-yellow-50",
  困难: "text-red-600 bg-red-50",
};

export default function PracticePage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">编程练习</h1>
            <p className="text-gray-500 text-sm mt-1">已完成 2 / 500 题</p>
          </div>
          <div className="bg-white rounded-full px-4 py-2 border border-gray-200 text-sm text-gray-600">
            🤖 AI逐级提示已开启
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                cat === "全部"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">状态</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">题目</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">难度</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">分类</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">通过率</th>
              </tr>
            </thead>
            <tbody>
              {PROBLEMS.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    {p.solved ? (
                      <span className="text-green-500 text-lg">✓</span>
                    ) : (
                      <span className="text-gray-200 text-lg">○</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`/practice/${p.id}`}
                      className="font-medium text-gray-900 hover:text-blue-500 transition-colors"
                    >
                      {p.id}. {p.title}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${DIFF_COLOR[p.difficulty]}`}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{p.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{p.acceptance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
