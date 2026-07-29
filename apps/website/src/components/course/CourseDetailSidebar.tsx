"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CourseDetailSidebarProps {
  price: number;
  originalPrice: number;
  guarantee: boolean;
  ctaUrl: string;
  ctaText: string;
}

export function CourseDetailSidebar({
  price,
  originalPrice,
  guarantee,
  ctaUrl,
  ctaText,
}: CourseDetailSidebarProps) {
  const [daysLeft, setDaysLeft] = useState(2);

  useEffect(() => {
    // 计算到月底剩余天数
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const diff = Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    setDaysLeft(diff);
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg sticky top-24">
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-orange-500">¥{price}</span>
          <span className="text-lg text-gray-400 line-through">¥{originalPrice}</span>
        </div>
        <span className="inline-block mt-1 text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
          限时优惠中
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span className="text-orange-500">⏰</span>
        <span>剩余 {daysLeft} 天恢复原价</span>
      </div>

      <a
        href={ctaUrl}
        className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-center py-3.5 rounded-xl transition-colors text-lg mb-3"
      >
        {ctaText}
      </a>

      <div className="space-y-2 text-sm text-gray-600">
        {guarantee && (
          <div className="flex items-center gap-2">
            <span className="text-green-500">🤝</span>
            <span>效果不满意可退款</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-green-500">✅</span>
          <span>微信客服 1v1 答疑</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✅</span>
          <span>永久回看课程录像</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✅</span>
          <span>课程持续更新</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          href="/guarantee"
          className="text-xs text-gray-500 hover:text-orange-500 transition-colors"
        >
          查看完整退款条款 →
        </Link>
      </div>
    </div>
  );
}
