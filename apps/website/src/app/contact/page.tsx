"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { submitContact } from "@/lib/api";

interface FormData {
  name: string;
  email: string;
  type: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    type: "课程咨询",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // 表单校验
    if (!formData.name.trim()) {
      setError("请填写姓名");
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("请填写有效的邮箱地址");
      return;
    }
    if (!formData.message.trim()) {
      setError("请填写消息内容");
      return;
    }

    setSubmitting(true);

    try {
      // 调用后端公开接口
      await submitContact({
        name: formData.name,
        email: formData.email,
        type: formData.type,
        message: formData.message,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-16">
        <section className="py-20 bg-gray-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-6xl mb-6 block">✅</span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">消息已发送</h1>
            <p className="text-gray-500 mb-2">感谢你的留言，我们会尽快回复！</p>
            <p className="text-sm text-gray-400 mb-8">
              通常在工作日 24 小时内响应，请留意邮箱 {formData.email}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                返回首页
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", type: "课程咨询", message: "" });
                }}
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-full hover:bg-gray-50 transition-colors"
              >
                继续发送
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">联系我们</h1>
          <p className="text-gray-500 text-center mb-12">商务合作、课程咨询、企业培训均可联系</p>

          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {[
              { icon: "📧", label: "商务邮件", value: "business@mniuai.com", href: "mailto:business@mniuai.com" },
              { icon: "💬", label: "微信客服", value: "扫码添加", href: "#" },
              { icon: "📢", label: "微信公众号", value: "萌牛AI", href: "#" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex flex-col items-center p-5 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all text-center"
              >
                <span className="text-3xl mb-2">{item.icon}</span>
                <span className="text-sm font-semibold text-gray-700 mb-1">{item.label}</span>
                <span className="text-xs text-gray-500">{item.value}</span>
              </a>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-100 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">发送消息</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 transition-colors"
                placeholder="你的姓名"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                邮箱 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1.5">
                咨询类型
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 transition-colors"
              >
                <option>课程咨询</option>
                <option>商务合作</option>
                <option>企业培训定制</option>
                <option>媒体/投资</option>
                <option>其他</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                消息 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 transition-colors resize-none"
                placeholder="请描述你的需求..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {submitting ? "发送中..." : "发送消息"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
