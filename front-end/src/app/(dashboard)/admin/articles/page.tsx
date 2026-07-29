"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Archive, Send } from "lucide-react";
import { articleApi } from "@/lib/api/article";
import type { ArticleSummary } from "@/lib/types/article";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "草稿", className: "bg-[#30363D] text-[#8B949E]" },
  PUBLISHED: { label: "已发布", className: "bg-green-500/20 text-green-400" },
  ARCHIVED: { label: "已归档", className: "bg-yellow-500/20 text-yellow-400" },
};

export default function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await articleApi.adminList(statusFilter || undefined);
      setArticles(res.items);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePublish = async (id: string) => {
    await articleApi.adminPublish(id);
    load();
  };

  const handleArchive = async (id: string) => {
    await articleApi.adminArchive(id);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除该文章？")) return;
    await articleApi.adminDelete(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Button className="bg-[#3B82F6]" onClick={() => router.push("/admin/articles/new")}>
          <Plus className="mr-2 h-4 w-4" />
          新建文章
        </Button>
      </div>

      <div className="flex gap-2">
        {["", "DRAFT", "PUBLISHED", "ARCHIVED"].map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(s)}
          >
            {s === "" ? "全部" : STATUS_LABELS[s]?.label ?? s}
          </Button>
        ))}
      </div>

      <Card className="border-[#30363D] bg-[#161B22] p-6">
        {loading ? (
          <p className="text-center text-[#8B949E]">加载中...</p>
        ) : articles.length === 0 ? (
          <p className="text-center text-[#8B949E]">暂无文章，点击右上角新建</p>
        ) : (
          <div className="space-y-2">
            {articles.map((article) => {
              const status = STATUS_LABELS[article.status] ?? { label: article.status, className: "bg-[#30363D] text-[#8B949E]" };
              return (
                <div
                  key={article.id}
                  className="flex items-center justify-between rounded border border-[#30363D] p-3 hover:border-[#3B82F6]/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{article.title}</p>
                    <p className="text-xs text-[#8B949E]">
                      {article.category} · {article.readMinutes} 分钟阅读 · 👁 {article.viewCount} · ❤ {article.likeCount}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-xs ${status.className}`}>
                      {status.label}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/articles/${article.id}`)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {article.status === "DRAFT" && (
                      <Button variant="ghost" size="icon" onClick={() => handlePublish(article.id)}>
                        <Send className="h-4 w-4 text-green-400" />
                      </Button>
                    )}
                    {article.status === "PUBLISHED" && (
                      <Button variant="ghost" size="icon" onClick={() => handleArchive(article.id)}>
                        <Archive className="h-4 w-4 text-yellow-400" />
                      </Button>
                    )}
                    {(article.status === "DRAFT" || article.status === "ARCHIVED") && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(article.id)}>
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
