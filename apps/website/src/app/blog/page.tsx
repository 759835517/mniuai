"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ALL_BLOG_POSTS } from "@/lib/blogData";

const CATEGORIES = ["全部", "AI工具教程", "技术深度", "学员故事", "行业趋势", "工具对比"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "全部") return ALL_BLOG_POSTS;
    return ALL_BLOG_POSTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="pt-16">
      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">博客</h1>
          <p className="text-gray-500">AI工具教程、行业趋势、学员故事和技术深度内容</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  c === selectedCategory
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {c}
                {c !== "全部" && (
                  <span className="ml-1 text-xs opacity-70">
                    ({ALL_BLOG_POSTS.filter((p) => p.category === c).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length > 0 ? (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-orange-200 hover:shadow-md transition-all group"
                >
                  <span className="text-4xl flex-shrink-0">{post.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs bg-orange-50 text-orange-600 font-medium px-2 py-0.5 rounded-full">{post.category}</span>
                      <span className="text-xs text-gray-400">{post.date}</span>
                      <span className="text-xs text-gray-400">· {post.readTime}阅读</span>
                    </div>
                    <h2 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="text-5xl mb-4 block">📝</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">该分类暂无文章</h3>
              <p className="text-gray-500">请选择其他分类查看</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
