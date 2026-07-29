import type { Metadata } from "next";
import { campusApi } from "@/lib/api";

export const metadata: Metadata = {
  title: "编程练习",
  description: "500道精选编程题，AI逐级提示，真实沙盒执行",
};

interface PracticeProblem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  acceptance: number;
  sortOrder: number;
}

const DIFF_COLOR: Record<string, string> = {
  入门: "text-green-600 bg-green-50",
  进阶: "text-yellow-600 bg-yellow-50",
  高级: "text-red-600 bg-red-50",
};

async function getProblems(): Promise<PracticeProblem[]> {
  try {
    const data = await campusApi.listProblems();
    return data || [];
  } catch (err) {
    console.error("获取编程练习失败:", err);
    return [];
  }
}

export default async function PracticePage() {
  const problems = await getProblems();

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">编程练习</h1>
            <p className="text-gray-500 text-sm mt-1">
              共 {problems.length} 道精选编程题
            </p>
          </div>
          <div className="bg-white rounded-full px-4 py-2 border border-gray-200 text-sm text-gray-600">
            🤖 AI逐级提示已开启
          </div>
        </div>

        {problems.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-4">💻</div>
            <p>暂无编程练习题目，请联系管理员配置</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">#</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">题目</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">难度</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">分类</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">通过率</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-400">{i + 1}</td>
                    <td className="px-6 py-4">
                      <a
                        href={`/practice/${p.id}`}
                        className="font-medium text-gray-900 hover:text-blue-500 transition-colors"
                      >
                        {p.title}
                      </a>
                      {p.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                          {p.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          DIFF_COLOR[p.difficulty] || "text-gray-600 bg-gray-50"
                        }`}
                      >
                        {p.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{p.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {p.acceptance ? `${Math.round(p.acceptance)}%` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
