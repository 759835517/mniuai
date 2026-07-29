import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { EngineerNavbar } from "@/components/layout/EngineerNavbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "萌牛AI程序员端 - AI工程师训练营",
    template: "%s | 萌牛AI程序员",
  },
  description:
    "AI驱动的工程师能力提升平台，AI编程实战+算法题库+AI面试官+系统设计，3~6个月完成技能升级，实现跳槽涨薪或晋升，对赌涨薪未达成全额退款。",
  keywords: ["AI编程", "算法刷题", "模拟面试", "系统设计", "跳槽涨薪", "工程师训练营"],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://app.mniuai.com"
  ),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://app.mniuai.com",
    siteName: "萌牛AI程序员端",
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
        <EngineerNavbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
