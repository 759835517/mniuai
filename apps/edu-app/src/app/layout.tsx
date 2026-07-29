import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { EduNavbar } from "@/components/layout/EduNavbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "萌牛AI教师端 - AI备课出题批改神器",
    template: "%s | 萌牛AI教师端",
  },
  description:
    "AI帮你备课，每周省出10小时。AI生成教案、智能出题组卷、自动批改作业、一键生成PPT课件，对赌协议保障效果。",
  keywords: ["AI备课", "AI出题", "AI批改", "教师工具", "教案生成", "对赌协议"],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://edu.mniuai.com"
  ),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://edu.mniuai.com",
    siteName: "萌牛AI教师端",
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
        <EduNavbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
