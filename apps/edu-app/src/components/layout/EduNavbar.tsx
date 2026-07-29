"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function EduNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tools = [
    { name: "AI备课助手", href: "/tools/lesson", icon: "📝" },
    { name: "AI出题机", href: "/tools/quiz", icon: "📋" },
    { name: "AI批改助手", href: "/tools/grade", icon: "✅" },
    { name: "AI课件生成", href: "/tools/slides", icon: "📊" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐮</span>
            <span className="font-bold text-lg text-gray-900">
              萌牛AI<span className="text-orange-500 text-sm ml-1">教师端</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-700 hover:text-orange-500 font-medium transition-colors">
                AI工具 <span className="text-xs">▼</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-orange-50 first:rounded-t-xl last:rounded-b-xl transition-colors"
                  >
                    <span className="text-xl">{tool.icon}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {tool.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/templates"
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
            >
              模板库
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
            >
              订阅计划
            </Link>
            <Link
              href="/guarantee"
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
            >
              对赌协议
            </Link>
            <Link
              href="/my/history"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              我的
            </Link>
            <Link
              href="/login"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-full transition-colors"
            >
              登录/注册
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="space-y-2">
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-orange-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-xl">{tool.icon}</span>
                  <span className="font-medium text-gray-700">{tool.name}</span>
                </Link>
              ))}
              <Link
                href="/templates"
                className="block px-4 py-2 hover:bg-orange-50 rounded-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                模板库
              </Link>
              <Link
                href="/pricing"
                className="block px-4 py-2 hover:bg-orange-50 rounded-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                订阅计划
              </Link>
              <Link
                href="/login"
                className="block text-center bg-orange-500 text-white font-semibold px-4 py-2 rounded-full mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                登录/注册
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
