import type { Metadata } from "next";
import "./globals.css";
import { ProNavbar } from "@/components/layout/ProNavbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://pro.mniuai.com"),
  title: { default: "萌牛AI职场版 - 职场人的AI效率工具", template: "%s | 萌牛AI职场版" },
  description: "专为产品经理、运营、市场人员打造的AI效率工具平台。AI文档写作、数据分析、会议纪要，每周节省10小时。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <ProNavbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
