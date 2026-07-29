import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-white mb-4">学习</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/paths" className="hover:text-blue-400">
                  学习路径
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-blue-400">
                  编程练习
                </Link>
              </li>
              <li>
                <Link href="/interview" className="hover:text-blue-400">
                  AI面试官
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">资源</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/portfolio" className="hover:text-blue-400">
                  作品集
                </Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-blue-400">
                  简历生成
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">关于</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="hover:text-blue-400">
                  订阅计划
                </Link>
              </li>
              <li>
                <Link href="/guarantee" className="hover:text-blue-400">
                  就业保障
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_MAIN_SITE + "/contact"}
                  className="hover:text-blue-400"
                >
                  联系我们
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">其他平台</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_MAIN_SITE || "#"}
                  className="hover:text-blue-400"
                >
                  官网首页
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_ENGINEER_APP || "#"}
                  className="hover:text-blue-400"
                >
                  程序员平台
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_EDU_APP || "#"}
                  className="hover:text-blue-400"
                >
                  教师平台
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2026 萌牛AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
