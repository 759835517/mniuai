import Link from "next/link";

const TOPICS = [
  { id: "tinyurl", name: "设计短链接服务", difficulty: "中等", tags: ["哈希", "缓存", "分布式ID"], done: true },
  { id: "rate-limiter", name: "设计限流器", difficulty: "中等", tags: ["令牌桶", "滑动窗口", "Redis"] },
  { id: "distributed-cache", name: "设计分布式缓存", difficulty: "困难", tags: ["一致性哈希", "LRU", "高可用"] },
  { id: "seckill", name: "设计秒杀系统", difficulty: "困难", tags: ["高并发", "削峰", "库存扣减"] },
  { id: "feed", name: "设计朋友圈/信息流", difficulty: "困难", tags: ["推拉模型", "Feed流", "扩散写"] },
  { id: "search", name: "设计搜索引擎", difficulty: "困难", tags: ["倒排索引", "分词", "排序"] },
  { id: "video-stream", name: "设计视频流媒体平台", difficulty: "困难", tags: ["CDN", "转码", "HLS"] },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  中等: "text-blue-500 bg-blue-50",
  困难: "text-red-500 bg-red-50",
};

export default function SystemDesignPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">系统设计题库</h1>
        <p className="text-gray-500 mb-8">
          中高级面试必备。AI 引导式解题：需求澄清 → 架构草图 → 技术选型 → 深入设计 → AI 评估。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOPICS.map((t) => (
            <Link
              key={t.id}
              href={`/system-design/${t.id}`}
              className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-lg">{t.name}</h3>
                {t.done && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    ✓ 已完成
                  </span>
                )}
              </div>
              <span
                className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-3 ${DIFFICULTY_COLOR[t.difficulty]}`}
              >
                {t.difficulty}
              </span>
              <div className="flex flex-wrap gap-2">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
