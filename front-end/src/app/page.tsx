"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Map, MessagesSquare, FolderKanban, Code2, ArrowRight, Sparkles,
  Zap, Rocket, Shield, Brain,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { useEffect } from "react";

const features = [
  { icon: Map, title: "AI 学习路线图", desc: "输入技能和目标，AI 生成个性化学习计划，每周任务清晰，进度可追踪。", color: "text-blue-400" },
  { icon: MessagesSquare, title: "AI 编程教练", desc: "24 小时在线的资深导师，代码问题随时问，帮你做代码审查。", color: "text-violet-400" },
  { icon: FolderKanban, title: "AI 项目教练", desc: "选择 RAG/Agent/SaaS/MCP 类型，AI 拆解任务、给出架构和代码模板。", color: "text-green-400" },
  { icon: Code2, title: "AI 代码审查", desc: "粘贴代码或输入 GitHub 链接，AI 审查安全、性能和可维护性。", color: "text-amber-400" },
];

const techStack = ["Python", "LangChain", "Spring AI", "Qwen", "pgvector", "FastAPI", "Docker", "Vector DB", "RAG", "Agent"];

export default function LandingPage() {
  const { isAuthenticated, hydrateFromStorage } = useAuthStore();
  useEffect(() => { hydrateFromStorage(); }, [hydrateFromStorage]);

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#F0F6FC]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[#30363D] bg-[#0D1117]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-[#3B82F6]" />
            <span className="text-lg font-bold">MNIU AI Camp</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" size="sm">登录</Button></Link>
            <Link href={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="sm" className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90">
                {isAuthenticated ? "进入工作台" : "免费注册"}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl text-center">
          <Badge variant="outline" className="mb-6 border-[#30363D] text-[#8B949E]">
            <Sparkles className="mr-1 h-3 w-3" /> AI 原生学习平台
          </Badge>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            为转型 AI 的工程师
            <br />
            打造的 <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">AI 原生</span> 学习工作台
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[#8B949E]">
            从 Java 到 RAG，从 Spring 到 Agent，AI 教练全程陪练，一份专属路线图帮你完成转型。
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-8 text-base shadow-glow hover:opacity-90">
                免费开始学习 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="border-[#30363D] text-base hover:bg-[#161B22]">
                了解更多
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Tech Ticker */}
      <section className="border-y border-[#30363D] bg-[#161B22]/50 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-6 overflow-hidden px-4 flex-wrap">
          {techStack.map((t) => (
            <span key={t} className="whitespace-nowrap rounded-full border border-[#30363D] bg-[#1C2128] px-4 py-1.5 text-sm text-[#8B949E]">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold">为什么选择 MNIU AI Camp？</h2>
          <p className="mb-16 text-center text-[#8B949E]">四大核心能力，覆盖 AI 工程学习全链路</p>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((f) => (
              <Card key={f.title} className="border-[#30363D] bg-[#161B22] p-6 transition-all hover:border-[#3B82F6]/30 hover:shadow-glow">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1C2128]">
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[#8B949E]">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-center text-3xl font-bold">四步开始你的 AI 学习之旅</h2>
          <div className="grid gap-12 md:grid-cols-4">
            {[
              { step: "01", title: "注册账号", desc: "填写技能和目标", icon: Shield },
              { step: "02", title: "生成路线图", desc: "AI 分析生成专属计划", icon: Map },
              { step: "03", title: "AI 教练陪练", desc: "随时提问，代码调试", icon: Brain },
              { step: "04", title: "实战成长", desc: "完成项目，获得成就", icon: Rocket },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] text-xl font-bold text-white">
                  {s.step}
                </div>
                <h3 className="mb-1 font-semibold">{s.title}</h3>
                <p className="text-sm text-[#8B949E]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">准备好开始你的 AI 转型之旅了吗？</h2>
          <p className="mb-8 text-[#8B949E]">免费注册，立即获得你的专属学习路线图。</p>
          <Link href={isAuthenticated ? "/dashboard" : "/register"}>
            <Button size="lg" className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-10 text-base shadow-glow hover:opacity-90">
              免费开始学习
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#30363D] px-4 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-sm text-[#8B949E] md:flex-row">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#3B82F6]" />
            <span className="font-semibold text-[#F0F6FC]">MNIU AI Camp</span>
          </div>
          <div>&copy; 2026 MNIU AI Camp. 保留所有权利。</div>
        </div>
      </footer>
    </div>
  );
}
