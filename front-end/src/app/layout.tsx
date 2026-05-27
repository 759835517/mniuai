import type { Metadata } from "next";
import { inter, jetbrainsMono } from "@/lib/fonts";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "MNIU AI Camp",
  description: "为转型 AI 开发的工程师打造的 AI 原生学习工作台",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans mniu-scrollbar antialiased`}>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="dark"
          toastOptions={{
            style: {
              background: "#161B22",
              border: "1px solid #30363D",
              color: "#F0F6FC",
            },
          }}
        />
      </body>
    </html>
  );
}
