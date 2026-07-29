"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Eye, Edit3 } from "lucide-react";
import { articleApi } from "@/lib/api/article";
import type { ArticleSummary } from "@/lib/types/article";

const CATEGORIES = ["前端", "后端", "AI", "算法", "面试", "职场", "其他"];

export default function AdminArticleEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [category, setCategory] = useState("前端");
  const [tags, setTags] = useState("");
  const [targetAudience, setTargetAudience] = useState("ALL");
  const [difficulty, setDifficulty] = useState("");
  const [readMinutes, setReadMinutes] = useState("");

  useEffect(() => {
    if (isNew) return;
    articleApi.adminGet(id)
      .then((a: ArticleSummary) => {
        setTitle(a.title);
        setSlug(a.slug);
        setSummary(a.summary);
        // content 只在 detail 返回，这里用 summary 占位
        setContent(a.summary);
        setCoverUrl(a.coverUrl ?? "");
        setCategory(a.category);
        setTags(a.tags.join(", "));
        setTargetAudience(a.targetAudience);
        setDifficulty(a.difficulty ?? "");
        setReadMinutes(a.readMinutes ? String(a.readMinutes) : "");
      })
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title,
        slug: slug || undefined,
        summary,
        content,
        coverUrl: coverUrl || undefined,
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        targetAudience: targetAudience || undefined,
        difficulty: difficulty || undefined,
        readMinutes: readMinutes ? parseInt(readMinutes, 10) : undefined,
      };
      if (isNew) {
        const created = await articleApi.adminCreate(payload);
        router.replace(`/admin/articles/${created.id}`);
      } else {
        await articleApi.adminUpdate(id, payload);
        router.push("/admin/articles");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-[#8B949E]">加载中...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/articles")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{isNew ? "新建文章" : `编辑: ${title}`}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreview(!preview)}>
            {preview ? <Edit3 className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {preview ? "编辑" : "预览"}
          </Button>
          <Button className="bg-[#3B82F6]" onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "保存中..." : "保存草稿"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 左侧编辑区 */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="border-[#30363D] bg-[#161B22] p-4">
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm text-[#8B949E]">标题</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="文章标题" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#8B949E]">摘要</label>
                <Textarea value={summary} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSummary(e.target.value)} placeholder="文章摘要..." rows={2} />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#8B949E]">正文 (Markdown)</label>
                {preview ? (
                  <div className="min-h-[400px] rounded border border-[#30363D] bg-[#0D1117] p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-[#E6EDF3]">{content}</pre>
                  </div>
                ) : (
                  <Textarea
                    value={content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                    placeholder="使用 Markdown 编写正文..."
                    rows={20}
                    className="font-mono text-sm"
                  />
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* 右侧元数据 */}
        <div className="space-y-4">
          <Card className="border-[#30363D] bg-[#161B22] p-4">
            <h3 className="mb-3 font-medium">文章设置</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm text-[#8B949E]">Slug</label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#8B949E]">分类</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded border border-[#30363D] bg-[#0D1117] px-3 py-2 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#8B949E]">标签 (逗号分隔)</label>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="React, Hooks" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#8B949E]">封面 URL</label>
                <Input value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#8B949E]">目标读者</label>
                <Input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="ALL" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#8B949E]">难度</label>
                <Input value={difficulty} onChange={(e) => setDifficulty(e.target.value)} placeholder="BEGINNER" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#8B949E]">阅读时长 (分钟)</label>
                <Input value={readMinutes} onChange={(e) => setReadMinutes(e.target.value)} placeholder="5" type="number" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
