"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Clock, Eye, MessageCircle } from "lucide-react";
import Link from "next/link";
import { articleApi } from "@/lib/api/article";
import type { ArticleDetail } from "@/lib/types/article";

interface TocItem {
  level: number;
  text: string;
  id: string;
}

function parseToc(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  const items: TocItem[] = [];
  lines.forEach((line, idx) => {
    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (match && match[1] && match[2]) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = `heading-${idx}-${text.toLowerCase().replace(/\s+/g, "-").slice(0, 30)}`;
      items.push({ level, text, id });
    }
  });
  return items;
}

function renderMarkdown(markdown: string): string {
  // Simple Markdown to HTML rendering (headers, bold, italic, code, lists, paragraphs)
  let html = markdown
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headers
    .replace(/^#### (.+)$/gm, "<h4 class=\"text-base font-semibold mt-4 mb-2\">$1</h4>")
    .replace(/^### (.+)$/gm, "<h3 class=\"text-lg font-semibold mt-5 mb-2\">$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 class=\"text-xl font-bold mt-6 mb-3\">$1</h2>")
    // Bold & Italic
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code class=\"rounded bg-[#30363D] px-1 py-0.5 text-sm text-[#E6EDF3]\">$1</code>")
    // Code blocks
    .replace(/```[\s\S]*?```/g, (match) => {
      const code = match.replace(/```\w*\n?/, "").replace(/```$/, "");
      return `<pre class="my-4 rounded bg-[#0D1117] p-4 overflow-x-auto text-sm"><code>${code}</code></pre>`;
    })
    // Unordered list items
    .replace(/^- (.+)$/gm, "<li class=\"ml-4 list-disc\">$1</li>")
    // Paragraphs
    .replace(/^(?!<[hluo]|<pre|<code|<li)(.+)$/gm, "<p class=\"my-2 leading-relaxed\">$1</p>");

  return html;
}

export default function ArticleReadingPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [scrollRatio, setScrollRatio] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastReportRef = useRef(0);
  const readSecondsRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    articleApi.getBySlug(slug)
      .then(setArticle)
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [slug]);

  // Scroll progress tracking + report
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;
    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight - el.clientHeight;
    const ratio = scrollHeight > 0 ? Math.min(1, scrollTop / scrollHeight) : 0;
    setScrollRatio(ratio);

    // Report every 5 seconds or at 85% completion
    const now = Date.now();
    if (article && (now - lastReportRef.current > 5000)) {
      lastReportRef.current = now;
      articleApi.reportProgress(article.id, {
        scrollRatio: ratio,
        readSeconds: readSecondsRef.current,
      }).catch(() => {});
      readSecondsRef.current = 0;
    }
  }, [article]);

  // Track reading time
  useEffect(() => {
    if (!article) return;
    timerRef.current = setInterval(() => {
      readSecondsRef.current += 1;
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      // Final report on unmount
      if (article) {
        articleApi.reportProgress(article.id, {
          scrollRatio,
          readSeconds: readSecondsRef.current,
        }).catch(() => {});
      }
    };
  }, [article, scrollRatio]);

  const handleLike = async () => {
    if (!article || liked) return;
    await articleApi.like(article.id);
    setLiked(true);
    setArticle({ ...article, likeCount: article.likeCount + 1 });
  };

  if (loading) return <p className="text-[#8B949E]">加载中...</p>;
  if (!article) return <p className="text-[#8B949E]">文章不存在</p>;

  const toc = parseToc(article.content);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/articles">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{article.title}</h1>
          <div className="mt-1 flex items-center gap-4 text-sm text-[#8B949E]">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readMinutes} 分钟</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.viewCount}</span>
            <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{article.likeCount}</span>
            <span>{article.authorName}</span>
          </div>
        </div>
        <Button variant={liked ? "default" : "outline"} size="sm" onClick={handleLike}>
          <Heart className={`mr-1 h-4 w-4 ${liked ? "fill-current" : ""}`} />
          {liked ? "已赞" : "点赞"}
        </Button>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full rounded bg-[#30363D]">
        <div className="h-1 rounded bg-[#3B82F6] transition-all" style={{ width: `${Math.round(scrollRatio * 100)}%` }} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* TOC Sidebar */}
        {toc.length > 0 && (
          <aside className="hidden lg:block">
            <Card className="sticky top-4 border-[#30363D] bg-[#161B22] p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
                <MessageCircle className="h-4 w-4" /> 目录
              </h3>
              <nav className="space-y-1">
                {toc.map((item, idx) => (
                  <a
                    key={idx}
                    href={`#${item.id}`}
                    className={`block rounded px-2 py-1 text-sm text-[#8B949E] hover:bg-[#30363D] hover:text-[#F0F6FC] ${
                      item.level === 3 ? "pl-4" : item.level === 4 ? "pl-6" : ""
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </Card>
          </aside>
        )}

        {/* Article Content */}
        <main className="lg:col-span-3">
          <Card className="border-[#30363D] bg-[#161B22] p-6">
            {article.coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={article.coverUrl} alt={article.title} className="mb-6 w-full rounded-lg object-cover" />
            )}
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded bg-[#3B82F6]/20 px-2 py-0.5 text-xs text-[#3B82F6]">{article.category}</span>
              {article.tags.map((tag) => (
                <span key={tag} className="rounded bg-[#30363D] px-2 py-0.5 text-xs text-[#8B949E]">{tag}</span>
              ))}
            </div>
            <div
              ref={contentRef}
              onScroll={handleScroll}
              className="max-h-[70vh] overflow-y-auto pr-2"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
            />
          </Card>
        </main>
      </div>
    </div>
  );
}
