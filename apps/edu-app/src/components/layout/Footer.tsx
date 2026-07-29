import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-white mb-4">AI工具</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tools/lesson" className="hover:text-orange-400">
                  AI备课助手
                </Link>
              </li>
              <li>
                <Link href="/tools/quiz" className="hover:text-orange-400">
                  AI出题机
                </Link>
              </li>
              <li>
                <Link href="/tools/grade" className="hover:text-orange-400">
                  AI批改助手
                </Link>
              </li>
              <li>
                <Link href="/tools/slides" className="hover:text-orange-400">
                  AI课件生成
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">资源</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/templates" className="hover:text-orange-400">
                  模板库
                </Link>
              </li>
              <li>
                <Link href="/my/lessons" className="hover:text-orange-400">
                  我的教案
                </Link>
              </li>
              <li>
                <Link href="/my/quizbank" className="hover:text-orange-400">
                  我的题库
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">关于</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="hover:text-orange-400">
                  订阅计划
                </Link>
              </li>
              <li>
                <Link href="/guarantee" className="hover:text-orange-400">
                  对赌协议
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_MAIN_SITE + "/contact"}
                  className="hover:text-orange-400"
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
                  className="hover:text-orange-400"
                >
                  官网首页
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_ENGINEER_APP || "#"}
                  className="hover:text-orange-400"
                >
                  程序员学习平台
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_KIDS_APP || "#"}
                  className="hover:text-orange-400"
                >
                  少儿编程平台
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
