import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "萌牛 AI 少儿编程 - 让孩子爱上编程",
  description: "8-15 岁少儿编程学习平台，Scratch、Python、算法竞赛一站式学习",
};

/**
 * 少儿端根布局
 * 使用明亮活泼的设计风格，适合少儿用户
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
