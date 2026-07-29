import Link from "next/link";

const GUARANTEES = [
  { persona: "程序员", promise: "找不到工作退款", cond: "有效学时 ≥ 80%", icon: "👨‍💻" },
  { persona: "大学生", promise: "毕业6个月未就业退款", cond: "完成3个作品集项目", icon: "🎓" },
  { persona: "少儿", promise: "竞赛未获奖退款", cond: "参加至少1次认可竞赛", icon: "👶" },
  { persona: "老师", promise: "效率未提升退款", cond: "工具使用 ≥ 50 次", icon: "👨‍🏫" },
];

export function GuaranteeStrip() {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">
            🤝 我们敢承诺，因为我们做到了
          </h2>
          <p className="text-gray-400 text-lg">
            学完没效果？全额退款，无理由，不废话
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {GUARANTEES.map((g) => (
            <div
              key={g.persona}
              className="bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-orange-500 transition-colors"
            >
              <div className="text-2xl mb-2">{g.icon}</div>
              <div className="text-sm font-semibold text-orange-400 mb-1">{g.persona}</div>
              <div className="text-white font-medium mb-2">✅ {g.promise}</div>
              <div className="text-xs text-gray-400">{g.cond}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/guarantee"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            查看完整退款条款 →
          </Link>
        </div>
      </div>
    </section>
  );
}
