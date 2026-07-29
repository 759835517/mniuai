import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-white mb-4">练习</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/practice" className="hover:text-brand-orange">
                  AI编程实战
                </Link>
              </li>
              <li>
                <Link href="/algorithms" className="hover:text-brand-orange">
                  算法题库
                </Link>
              </li>
              <li>
                <Link href="/system-design" className="hover:text-brand-orange">
                  系统设计
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">面试</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/interview" className="hover:text-brand-orange">
                  AI面试官
                </Link>
              </li>
              <li>
                <Link href="/code-review" className="hover:text-brand-orange">
                  代码审查
                </Link>
              </li>
              <li>
                <Link href="/assessment" className="hover:text-brand-orange">
                  能力诊断
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">关于</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pricing" className="hover:text-brand-orange">
                  订阅计划
                </Link>
              </li>
              <li>
                <Link href="/guarantee" className="hover:text-brand-orange">
                  对赌涨薪
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_MAIN_SITE + "/contact"}
                  className="hover:text-brand-orange"
                >
                  联系我们
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">其他平台</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_MAIN_SITE || "#"}
                  className="hover:text-brand-orange"
                >
                  官网首页
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_CAMPUS_APP || "#"}
                  className="hover:text-brand-orange"
                >
                  大学生平台
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© 2026 萌牛AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
