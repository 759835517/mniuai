import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "学习路径",
  description: "4条经过验证的就业路径，70%学员6个月内成功就业",
};

const PATHS = [
  {
    id: "fullstack",
    name: "全栈工程师路径",
    duration: "12周",
    level: "L0→L4",
    icon: "💻",
    desc: "从零到全栈，完成2个真实项目，掌握React+Spring Boot+部署",
    popular: true,
    salary: "¥10K~18K",
    chapters: 48,
    projects: 2,
    practices: 200,
    tags: ["React", "Spring Boot", "MySQL", "Docker"],
  },
  {
    id: "frontend",
    name: "前端工程师路径",
    duration: "10周",
    level: "L0→L3",
    icon: "🎨",
    desc: "React/Vue精通，完成作品集，面向互联网前端岗位",
    popular: false,
    salary: "¥8K~15K",
    chapters: 40,
    projects: 3,
    practices: 180,
    tags: ["React", "Vue3", "TypeScript", "Tailwind"],
  },
  {
    id: "backend-java",
    name: "Java后端路径",
    duration: "12周",
    level: "L0→L4",
    icon: "☕",
    desc: "Spring Boot企业级开发，完成微服务项目，对接大厂后端岗",
    popular: false,
    salary: "¥10K~20K",
    chapters: 52,
    projects: 2,
    practices: 220,
    tags: ["Java", "Spring Boot", "MyBatis", "Redis"],
  },
  {
    id: "data-analysis",
    name: "数据分析路径",
    duration: "8周",
    level: "L0→L3",
    icon: "📊",
    desc: "Python数据分析+BI可视化，适合非CS转行数据岗",
    popular: false,
    salary: "¥8K~14K",
    chapters: 32,
    projects: 2,
    practices: 150,
    tags: ["Python", "Pandas", "SQL", "Tableau"],
  },
];

export default function PathsPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">选择你的学习路径</h1>
          <p className="text-gray-500">4条经过验证的就业路径，70%学员6个月内成功就业</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PATHS.map((path) => (
            <Link
              key={path.id}
              href={`/paths/${path.id}`}
              className="bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{path.icon}</span>
                <div className="flex flex-col items-end gap-1">
                  {path.popular && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-500 text-white">最热门</span>
                  )}
                  <span className="text-sm font-semibold text-green-600">{path.salary}</span>
                </div>
              </div>
              <h2 className="font-bold text-gray-900 text-xl mb-2">{path.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{path.desc}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {path.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
                <div><div className="font-bold text-gray-700 text-sm">{path.duration}</div><div>学习周期</div></div>
                <div><div className="font-bold text-gray-700 text-sm">{path.chapters}章</div><div>课程内容</div></div>
                <div><div className="font-bold text-gray-700 text-sm">{path.practices}题</div><div>编程练习</div></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
