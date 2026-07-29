import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BLOG_POSTS, ALL_BLOG_POSTS } from "@/lib/blogData";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return ALL_BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = BLOG_POSTS[params.slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
  };
}

// 简单的 Markdown 渲染（支持标题、列表、表格、加粗、代码块）
function renderMarkdown(content: string) {
  const lines = content.trim().split("\n");
  const elements: JSX.Element[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 代码块
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // 跳过结束 \`\`\`
      elements.push(
        <pre key={i} className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto text-sm my-4">
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // 标题
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          {line.replace("## ", "")}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-3">
          {line.replace("### ", "")}
        </h3>
      );
      i++;
      continue;
    }

    // 表格
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines
        .filter((l) => !l.match(/^\|[\s-|]+\|$/)) // 跳过分隔行
        .map((l) => l.split("|").filter(Boolean).map((c) => c.trim()));

      if (rows.length > 0) {
        elements.push(
          <div key={i} className="overflow-x-auto my-4">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  {rows[0].map((cell, j) => (
                    <th key={j} className="px-4 py-2.5 text-left font-semibold text-gray-700 border-b border-gray-200">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.slice(1).map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td key={c} className="px-4 py-2.5 text-gray-600">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // 无序列表
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].replace("- ", ""));
        i++;
      }
      elements.push(
        <ul key={i} className="space-y-2 my-4 ml-4">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 有序列表
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={i} className="space-y-2 my-4 ml-4">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-gray-700">
              <span className="text-orange-500 font-medium">{j + 1}.</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 空行
    if (line.trim() === "") {
      i++;
      continue;
    }

    // 普通段落
    elements.push(
      <p key={i} className="text-gray-700 leading-relaxed my-3" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
    );
    i++;
  }

  return elements;
}

// 处理行内格式：加粗、链接
function formatInline(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 text-orange-600 px-1.5 py-0.5 rounded text-sm">$1</code>');
}

export default function BlogPostPage({ params }: Props) {
  const post = BLOG_POSTS[params.slug];
  if (!post) notFound();

  // 相关文章
  const related = ALL_BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && (p.category === post.category || p.persona === post.persona)
  ).slice(0, 3);

  return (
    <div className="pt-16">
      {/* 顶部封面 */}
      <div className={`bg-gradient-to-br ${post.coverGradient} py-16`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <span className="text-5xl mb-4 block">{post.emoji}</span>
          <span className="inline-block bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center justify-center gap-4 text-sm text-white/80">
            <span>{post.author.name}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}阅读</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 文章内容 */}
          <article className="lg:col-span-3">
            <div className="max-w-3xl">
              {/* 作者信息 */}
              <div className="flex items-center gap-3 pb-6 mb-6 border-b border-gray-100">
                <span className="text-3xl">{post.author.avatar}</span>
                <div>
                  <div className="font-medium text-gray-900">{post.author.name}</div>
                  <div className="text-sm text-gray-500">{post.author.role}</div>
                </div>
              </div>

              {/* 正文 */}
              <div className="prose prose-lg max-w-none">
                {renderMarkdown(post.content)}
              </div>

              {/* 标签 */}
              <div className="mt-10 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 分享 */}
              <div className="mt-6 flex items-center gap-3">
                <span className="text-sm text-gray-500">分享到：</span>
                <button className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  📋 复制链接
                </button>
              </div>

              {/* 人群落地页 CTA */}
              {post.relatedPersonaSlug && (
                <div className="mt-10 bg-orange-50 border border-orange-100 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-2">
                    对 {post.persona} 群体感兴趣？
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    萌牛AI 为 {post.persona} 群体提供专属 AI 学习课程，对赌协议保障效果。
                  </p>
                  <Link
                    href={`/for/${post.relatedPersonaSlug}`}
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-full transition-colors text-sm"
                  >
                    了解更多 →
                  </Link>
                </div>
              )}
            </div>
          </article>

          {/* 右侧边栏 */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* 目录（简化版） */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 mb-3">文章目录</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {post.content
                    .split("\n")
                    .filter((l) => l.startsWith("## ") || l.startsWith("### "))
                    .map((l, i) => (
                      <li key={i} className={`${l.startsWith("### ") ? "ml-3" : ""} hover:text-orange-500 cursor-pointer transition-colors`}>
                        {l.replace(/^#{2,3}\s/, "")}
                      </li>
                    ))}
                </ul>
              </div>

              {/* 作者卡片 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{post.author.avatar}</span>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{post.author.name}</div>
                    <div className="text-xs text-gray-500">{post.author.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 相关文章推荐 */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">相关文章推荐</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-orange-50 text-orange-600 font-medium px-2 py-0.5 rounded-full">
                      {p.category}
                    </span>
                    <span className="text-xs text-gray-400">{p.readTime}阅读</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
