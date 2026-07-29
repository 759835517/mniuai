import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OrganizationStructuredData } from "@/components/shared/StructuredData";
import { AnalyticsProvider } from "@/components/shared/AnalyticsProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "萌牛AI - AI赋能全社会学习平台",
    template: "%s | 萌牛AI",
  },
  description:
    "萌牛AI为程序员、少儿、大学生、教师、自媒体等人群提供AI学习和工具平台，对赌协议保障学习效果。",
  keywords: ["AI学习", "AI编程", "少儿编程", "AI备课", "AI获客", "对赌协议"],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://mniuai.com"
  ),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://mniuai.com",
    siteName: "萌牛AI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <OrganizationStructuredData />
      </head>
      <body className={inter.className}>
        <AnalyticsProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
