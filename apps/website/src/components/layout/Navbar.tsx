"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { clsx } from "clsx";

const PERSONAS = [
  { label: "程序员", icon: "👨‍💻", href: "/for/engineer", desc: "AI编程 · 面试训练营" },
  { label: "少儿编程", icon: "👶", href: "/for/kids", desc: "竞赛获奖 · AI启蒙" },
  { label: "大学生", icon: "🎓", href: "/for/campus", desc: "零基础就业保障" },
  { label: "老师", icon: "👨‍🏫", href: "/for/teacher", desc: "AI备课 · 效率提升" },
  { label: "自媒体", icon: "📱", href: "/for/creator", desc: "AI创作 · 涨粉增收" },
  { label: "小老板", icon: "🏪", href: "/for/business", desc: "AI获客 · 门店引流" },
];

const NAV_LINKS = [
  { label: "产品", hasDropdown: true },
  { label: "课程", href: "/courses" },
  { label: "定价", href: "/pricing" },
  { label: "案例", href: "/success-stories" },
  { label: "博客", href: "/blog" },
  { label: "关于我们", href: "/about" },
];

const ENGINEER_APP = process.env.NEXT_PUBLIC_ENGINEER_APP_URL || "https://app.mniuai.com";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <span className="text-2xl">🐮</span>
          <span>萌牛AI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((item) =>
            item.hasDropdown ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors py-2">
                  {item.label}
                  <ChevronDown size={14} />
                </button>
                {megaMenuOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 grid grid-cols-2 gap-2 w-72">
                      {PERSONAS.map((p) => (
                        <Link
                          key={p.href}
                          href={p.href}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50 transition-colors"
                        >
                          <span className="text-xl">{p.icon}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{p.label}</div>
                            <div className="text-xs text-gray-500">{p.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={`${ENGINEER_APP}/login`}
            className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
          >
            登录
          </Link>
          <Link
            href="#personas"
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
          >
            免费开始
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="切换菜单"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-100">
            {PERSONAS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-orange-50"
              >
                <span>{p.icon}</span>
                <span className="text-sm font-medium">{p.label}</span>
              </Link>
            ))}
          </div>
          {NAV_LINKS.filter((i) => !i.hasDropdown).map((item) => (
            <Link
              key={item.label}
              href={item.href!}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-gray-700 py-2"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link
              href={`${ENGINEER_APP}/login`}
              className="text-center py-2 border border-gray-300 rounded-full text-sm font-medium"
            >
              登录
            </Link>
            <Link
              href="#personas"
              onClick={() => setMobileOpen(false)}
              className="text-center py-2 bg-orange-500 text-white rounded-full text-sm font-semibold"
            >
              免费开始
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
