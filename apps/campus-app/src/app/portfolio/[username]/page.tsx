import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  return { title: `${params.username} 的作品集` };
}

const MOCK_USER = {
  name: "张同学",
  username: "zhangsan",
  school: "某二本 计算机专业",
  level: "L4 全栈工程师",
  path: "全栈工程师路径",
  completedAt: "2026-05",
  bio: "热爱编程，擅长React+Spring Boot全栈开发，寻找2026届实习/校招机会",
  skills: ["React", "TypeScript", "Spring Boot", "MySQL", "Docker", "Redis"],
  projects: [
    {
      id: 1,
      name: "校园二手交易平台",
      desc: "React+Spring Boot全栈项目，实现商品发布、搜索、IM聊天、安全支付",
      tech: ["React", "Spring Boot", "WebSocket", "Alipay SDK"],
      github: "#",
      demo: "#",
    },
    {
      id: 2,
      name: "AI简历分析助手",
      desc: "接入Qwen大模型，解析简历PDF，生成岗位匹配分析报告",
      tech: ["Next.js", "Python FastAPI", "Qwen API"],
      github: "#",
      demo: "#",
    },
  ],
  stats: {
    practices: 200,
    streak: 87,
    completedWeeks: 12,
  },
};

export default function PortfolioPage({ params }: { params: { username: string } }) {
  const user = MOCK_USER;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 mb-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl shrink-0">👨‍💻</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{user.level}</span>
              </div>
              <div className="text-sm text-gray-500 mb-3">{user.school} · {user.path} · 完成于 {user.completedAt}</div>
              <p className="text-sm text-gray-600 mb-4">{user.bio}</p>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((s) => (
                  <span key={s} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 text-center">
            <div><div className="text-xl font-bold text-gray-900">{user.stats.practices}</div><div className="text-xs text-gray-400">刷题数</div></div>
            <div><div className="text-xl font-bold text-gray-900">{user.stats.streak}天</div><div className="text-xs text-gray-400">最长连续打卡</div></div>
            <div><div className="text-xl font-bold text-gray-900">{user.stats.completedWeeks}周</div><div className="text-xs text-gray-400">完成课程</div></div>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
          <h2 className="font-bold text-gray-900 mb-5">项目作品</h2>
          <div className="space-y-5">
            {user.projects.map((proj) => (
              <div key={proj.id} className="border border-gray-100 rounded-xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                  <div className="flex gap-2">
                    <a href={proj.github} className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-2 py-1 rounded">GitHub</a>
                    <a href={proj.demo} className="text-xs text-blue-500 hover:text-blue-600 border border-blue-200 px-2 py-1 rounded">Demo</a>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3">{proj.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {proj.tech.map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-500 rounded">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm">
            我也要创建作品集 →
          </Link>
        </div>
      </div>
    </div>
  );
}
