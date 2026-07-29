import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "关于我们",
  description: "萌牛AI公司介绍，使命是让每个人都能用AI提升工作效率与生活质量。",
};

const MILESTONES = [
  { year: "2024.01", event: "萌牛AI成立，专注程序员AI编程培训" },
  { year: "2024.06", event: "推出对赌协议，首批200名学员参与" },
  { year: "2024.12", event: "学员规模突破2000人，满意度94%" },
  { year: "2025.06", event: "扩展至少儿、大学生、教师等多个人群" },
  { year: "2026.01", event: "正式上线 mniuai.com，服务社会多个行业" },
];

const STATS = [
  { value: "12,000+", label: "在学学员" },
  { value: "94%", label: "满意度" },
  { value: "6", label: "覆盖行业" },
  { value: "¥0", label: "无效退款" },
];

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-6xl block mb-6">🐮</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            让每个人都能用 AI 提升工作效率与生活质量
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            萌牛AI（mniuai.com）是一个全社会 AI 赋能综合平台，
            服务程序员、少儿、大学生、教师、自媒体运营者、门店小老板等多个社会群体。
          </p>
        </div>
      </section>

      {/* 数据 */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-orange-500 mb-1">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 发展历程 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">发展历程</h2>
          <div className="space-y-4">
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-24 text-sm font-semibold text-orange-500 pt-1">{m.year}</div>
                <div className="flex-1 bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-gray-700 text-sm">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 加入我们 */}
      <section id="join" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">加入我们</h2>
          <p className="text-gray-500 mb-8">我们正在寻找热爱教育和 AI 的伙伴，一起让更多人受益于 AI 的力量。</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            联系我们 →
          </Link>
        </div>
      </section>
    </div>
  );
}
