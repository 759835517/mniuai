"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CampusNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="font-bold text-lg text-gray-900">
              萌牛AI<span className="text-blue-500 text-sm ml-1">大学生</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/paths"
              className="text-gray-700 hover:text-blue-500 font-medium transition-colors"
            >
              学习路径
            </Link>
            <Link
              href="/practice"
              className="text-gray-700 hover:text-blue-500 font-medium transition-colors"
            >
              编程练习
            </Link>
            <Link
              href="/interview"
              className="text-gray-700 hover:text-blue-500 font-medium transition-colors"
            >
              AI面试官
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-blue-500 font-medium transition-colors"
            >
              订阅计划
            </Link>
            <Link
              href="/guarantee"
              className="text-gray-700 hover:text-blue-500 font-medium transition-colors"
            >
              就业保障
            </Link>
            <Link
              href="/my/progress"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              我的
            </Link>
            <Link
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-full transition-colors"
            >
              登录/注册
            </Link>
          </div>

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

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="space-y-2">
              {[
                { label: "学习路径", href: "/paths" },
                { label: "编程练习", href: "/practice" },
                { label: "AI面试官", href: "/interview" },
                { label: "订阅计划", href: "/pricing" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 hover:bg-blue-50 rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="block text-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-full mt-4"
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
