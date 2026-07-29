import Link from "next/link";

const DIMENSIONS = [
  { name: "算法正确性", score: 82, weight: "35%" },
  { name: "代码质量", score: 75, weight: "20%" },
  { name: "沟通表达", score: 88, weight: "20%" },
  { name: "问题理解", score: 79, weight: "15%" },
  { name: "时间管理", score: 70, weight: "10%" },
];

const WEAK_POINTS = [
  {
    topic: "动态规划",
    detail: "在第2题状态转移方程推导时思路不清晰，建议专项练习背包类问题。",
  },
  {
    topic: "边界处理",
    detail: "编码时未考虑空数组和单元素场景，面试中易被追问。",
  },
];

export default function InterviewReportPage() {
  const total = Math.round(
    DIMENSIONS.reduce((sum, d) => sum + d.score, 0) / DIMENSIONS.length
  );

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* 总评分 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center mb-6">
          <div className="text-sm text-gray-500 mb-2">本次模拟面试综合评分</div>
          <div className="text-6xl font-bold text-blue-500 mb-2">{total}</div>
          <div className="text-sm text-gray-400 mb-4">
            超过 68% 的同级别工程师 · 预估真实面试通过率 62%
          </div>
          <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 text-sm px-4 py-2 rounded-full">
            💡 距离大厂 P6 水平还差一点，重点突破动态规划
          </div>
        </div>

        {/* 维度评分 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">能力维度分析</h2>
          <div className="space-y-4">
            {DIMENSIONS.map((d) => (
              <div key={d.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">
                    {d.name}{" "}
                    <span className="text-gray-400 text-xs">({d.weight})</span>
                  </span>
                  <span className="font-semibold text-gray-900">{d.score}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      d.score >= 80
                        ? "bg-green-500"
                        : d.score >= 70
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                    }`}
                    style={{ width: `${d.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 薄弱点 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">薄弱点与改进建议</h2>
          <div className="space-y-3">
            {WEAK_POINTS.map((w) => (
              <div key={w.topic} className="bg-red-50 rounded-xl p-4">
                <div className="font-semibold text-red-600 text-sm mb-1">
                  ⚠ {w.topic}
                </div>
                <div className="text-sm text-gray-600">{w.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/interview"
            className="flex-1 text-center bg-blue-500 text-white font-semibold py-3 rounded-full hover:bg-blue-600"
          >
            再来一轮
          </Link>
          <Link
            href="/my/progress"
            className="flex-1 text-center border border-gray-300 bg-white text-gray-700 font-semibold py-3 rounded-full hover:border-blue-300"
          >
            查看学习进度
          </Link>
        </div>
      </div>
    </div>
  );
}
