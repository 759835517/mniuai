"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

type Mode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("请输入有效的邮箱地址");
      return;
    }
    if (!password || password.length < 8) {
      setError("密码至少8位");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError("请输入你的姓名");
      return;
    }

    setSubmitting(true);
    try {
      const endpoint =
        mode === "login" ? "/api/v1/auth/login" : "/api/v1/auth/register";
      const body =
        mode === "login"
          ? { email, password }
          : { email, password, name };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || (mode === "login" ? "登录失败" : "注册失败"));
      }

      window.location.href = "/tools/lesson";
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-orange-50 flex items-center">
      <div className="max-w-md mx-auto w-full px-4 py-12">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🐮</span>
            <span className="font-bold text-xl text-gray-900">
              萌牛AI <span className="text-orange-500">教师端</span>
            </span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">
            注册即送7天专业版体验，无需绑卡
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          {/* Tab 切换 */}
          <div className="flex mb-6 border-b border-gray-100">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                  mode === m
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {m === "login" ? "登录" : "注册"}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  姓名
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="你的姓名"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "至少8位" : "请输入密码"}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {submitting
                ? "请稍候..."
                : mode === "login"
                ? "登录"
                : "注册并开始7天免费体验"}
            </button>
          </form>

          {mode === "register" && (
            <p className="text-xs text-gray-400 text-center mt-4">
              注册即表示同意{" "}
              <Link href="/terms" className="text-orange-500 hover:underline">
                服务条款
              </Link>{" "}
              和{" "}
              <Link href="/privacy" className="text-orange-500 hover:underline">
                隐私政策
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
