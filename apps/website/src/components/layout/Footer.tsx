import Link from "next/link";

const FOOTER_LINKS = {
  关于萌牛AI: [
    { label: "公司简介", href: "/about" },
    { label: "加入我们", href: "/about#join" },
    { label: "联系我们", href: "/contact" },
  ],
  产品列表: [
    { label: "程序员AI训练营", href: "/for/engineer" },
    { label: "少儿编程", href: "/for/kids" },
    { label: "大学生就业班", href: "/for/campus" },
    { label: "教师AI助手", href: "/for/teacher" },
    { label: "自媒体工具", href: "/for/creator" },
    { label: "小老板获客", href: "/for/business" },
  ],
  学习资源: [
    { label: "博客", href: "/blog" },
    { label: "成功案例", href: "/success-stories" },
    { label: "对赌协议说明", href: "/guarantee" },
    { label: "课程广场", href: "/courses" },
    { label: "定价套餐", href: "/pricing" },
  ],
  联系我们: [
    { label: "business@mniuai.com", href: "mailto:business@mniuai.com" },
    { label: "微信公众号", href: "#" },
    { label: "微信客服", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold text-sm mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐮</span>
            <span className="text-white font-semibold">萌牛AI</span>
            <span>© 2026 mniuai.com</span>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link>
            <Link href="/terms" className="hover:text-white transition-colors">服务条款</Link>
            <span>ICP备XXXXXXXX号</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
