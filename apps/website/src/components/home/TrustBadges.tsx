"use client";

import { motion } from "framer-motion";
import { CountUpNumber } from "@/components/shared/CountUpNumber";

const BADGES = [
  { value: 12000, suffix: "+", label: "学员", icon: "👥" },
  { value: 94, suffix: "%", label: "满意度", icon: "⭐" },
  { value: 0, prefix: "¥", label: "无效退款", icon: "💰", href: "/guarantee" },
  { value: 6, label: "个行业覆盖", icon: "🏭" },
];

export function TrustBadges() {
  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BADGES.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl mb-1">{b.icon}</div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                <CountUpNumber
                  end={b.value}
                  suffix={b.suffix}
                  prefix={b.prefix}
                />
              </div>
              <div className="text-sm text-gray-500 mt-1">{b.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
