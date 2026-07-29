import Link from "next/link";

const COLS = [
  {
    title: "AI工具",
    links: [
      { label: "文档写作", href: "/writing" },
      { label: "数据分析", href: "/data-analysis" },
      { label: "会议纪要", href: "/meeting" },
      { label: "简历优化", href: "/resume" },
      { label: "汇报材料", href: "/report" },
    ],
  },
  {
    title: "学习成长",
    links: [
      { label: "能力诊断", href: "/assessment" },
      { label: "职场模板库", href: "/templates" },
      { label: "工具广场", href: "/tools" },
    ],
  },
  {
    title: "订阅",
    links: [
      { label: "订阅计划", href: "/pricing" },
      { label: "对赌协议", href: "/guarantee" },
      { label: "我的进度", href: "/my/progress" },
    ],
  },
  {
    title: "关于",
    links: [
      { label: "服务协议", href: "/terms" },
      { label: "隐私政策", href: "/privacy" },
      { label: "联系我们", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm hover:text-green-400 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🐮</span>
            <span className="text-white font-bold text-sm">萌牛AI职场版</span>
          </Link>
          <p className="text-xs text-gray-500">© 2026 萌牛AI. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
}
