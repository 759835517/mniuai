import { PERSONA_DATA } from "@/lib/personaData";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: { persona: string };
}

export async function generateStaticParams() {
  return Object.keys(PERSONA_DATA).map((persona) => ({ persona }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = PERSONA_DATA[params.persona];
  if (!data) return {};
  return {
    title: data.title,
    description: data.heroSubtitle,
  };
}

export default function PersonaPage({ params }: Props) {
  const data = PERSONA_DATA[params.persona];
  if (!data) notFound();

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-6xl mb-6 block">{data.icon}</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {data.heroTitle}
          </h1>
          <p className="text-xl text-gray-500 mb-8">{data.heroSubtitle}</p>
          <a
            href={`${data.appUrl}/register`}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
          >
            {data.ctaText}
          </a>
        </div>
      </section>

      {/* 痛点 */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">你是否也有这些困惑？</h2>
          <div className="space-y-4">
            {data.pains.map((pain, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4"
              >
                <span className="text-red-400 text-lg mt-0.5">😟</span>
                <p className="text-gray-700">{pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 学习路径时间轴 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">核心学习路径</h2>
          <div className="space-y-4">
            {data.timeline.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  {i < data.timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-orange-200 mt-2 min-h-[2rem]" />
                  )}
                </div>
                <div className="bg-white rounded-xl p-4 flex-1 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                      {item.week}
                    </span>
                    <span className="font-semibold text-gray-900">{item.topic}</span>
                  </div>
                  <p className="text-sm text-gray-500">目标：{item.goal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 对赌协议 */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">🤝 对赌协议保障</h2>
          <p className="text-2xl font-bold text-orange-400 mb-6">{data.guarantee.condition}</p>
          <div className="bg-gray-800 rounded-2xl p-6 mb-8">
            <p className="text-gray-400 text-sm mb-3">学习门槛（需同时满足）：</p>
            <ul className="space-y-2">
              {data.guarantee.requirements.map((req, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✅</span>
                  <span className="text-gray-300">{req}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link href="/guarantee" className="text-orange-400 hover:text-orange-300 text-sm underline underline-offset-2">
            查看完整退款条款 →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">常见问题</h2>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Q：{faq.q}</h3>
                <p className="text-gray-600 text-sm">A：{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 最终 CTA */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{data.ctaText}</h2>
          <p className="text-orange-100 mb-8">对赌协议保障，学不会全额退款</p>
          <a
            href={`${data.appUrl}/register`}
            className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold px-8 py-4 rounded-full hover:bg-orange-50 transition-colors text-lg"
          >
            {data.icon} 立即开始 →
          </a>
        </div>
      </section>
    </div>
  );
}
