import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CampusNavbar } from "@/components/layout/CampusNavbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "萌牛AI大学生端 - 零基础就业保障",
    template: "%s | 萌牛AI大学生",
  },
  description:
    "AI驱动的零基础就业保障平台，视频课程+AI编程助手+真实项目+AI面试官，3~6个月从零到就业，6个月未就业全额退款。",
  keywords: ["大学生就业", "AI编程", "模拟面试", "对赌就业", "编程学习"],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://campus.mniuai.com"
  ),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://campus.mniuai.com",
    siteName: "萌牛AI大学生端",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <CampusNavbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
