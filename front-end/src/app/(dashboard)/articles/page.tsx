"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { articleApi } from "@/lib/api/article";
import type { ArticleSummary } from "@/lib/types/article";

const CATEGORIES = [
  { value: "", label: "全部分类" },
  { value: "前端", label: "前端" },
  { value: "后端", label: "后端" },
  { value: "AI", label: "AI" },
  { value: "算法", label: "算法" },
  { value: "面试", label: "面试" },
  { value: "职场", label: "职场" },
  { value: "其他", label: "其他" },
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await articleApi.list(category || undefined);
      setArticles(res.items);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="text-[#8B949E]">加载中...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">文章</h1>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`rounded px-3 py-1.5 text-sm transition ${
              category === c.value
                ? "bg-[#3B82F6] text-white"
                : "bg-[#30363D] text-[#8B949E] hover:bg-[#3B82F6]/20"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {articles.length === 0 ? (
        <Card className="border-[#30363D] bg-[#161B22] p-12 text-center">
          <p className="text-[#8B949E]">暂无文章</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`}>
              <Card className="cursor-pointer border-[#30363D] bg-[#161B22] transition-all hover:border-[#3B82F6]/30 hover:shadow-glow">
                <div className="aspect-video w-full overflow-hidden rounded-t bg-[#0D1117]">
                  {article.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={article.coverUrl} alt={article.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#8B949E]">暂无封面</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 font-semibold text-[#F0F6FC]">{article.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-[#8B949E]">{article.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded bg-[#3B82F6]/20 px-2 py-0.5 text-xs text-[#3B82F6]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-[#8B949E]">
                    {article.readMinutes} 分钟阅读 · 👁 {article.viewCount} · ❤ {article.likeCount}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
