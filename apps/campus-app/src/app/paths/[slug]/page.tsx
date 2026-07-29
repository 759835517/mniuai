import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return { title: `学习路径详情` };
}

const PATH_DATA: Record<string, {
  name: string; icon: string; duration: string; level: string; salary: string;
  desc: string; tags: string[]; projects: number; practices: number;
  curriculum: { week: string; title: string; lessons: string[] }[];
}> = {
  fullstack: {
    name: "全栈工程师路径", icon: "💻", duration: "12周", level: "L0→L4",
    salary: "¥10K~18K", desc: "从零到全栈，完成2个真实项目，掌握React+Spring Boot+部署",
    tags: ["React", "Spring Boot", "MySQL", "Docker"], projects: 2, practices: 200,
    curriculum: [
      { week: "第1-2周", title: "编程基础与Web入门", lessons: ["HTML/CSS基础", "JavaScript核心", "Git版本控制", "AI辅助编程入门"] },
      { week: "第3-5周", title: "React前端开发", lessons: ["React组件与Props", "状态管理Hooks", "React Router路由", "Axios接口调用", "Tailwind CSS样式"] },
      { week: "第6-8周", title: "Java后端开发", lessons: ["Java基础语法", "Spring Boot入门", "MyBatis数据库操作", "RESTful API设计", "JWT认证"] },
      { week: "第9-10周", title: "全栈项目实战一", lessons: ["项目需求分析", "数据库设计", "前后端联调", "项目部署上线"] },
      { week: "第11-12周", title: "进阶与就业准备", lessons: ["Redis缓存", "Docker容器化", "CI/CD流水线", "项目二开发", "简历+面试准备"] },
    ],
  },
  frontend: {
    name: "前端工程师路径", icon: "🎨", duration: "10周", level: "L0→L3",
    salary: "¥8K~15K", desc: "React/Vue精通，完成作品集，面向互联网前端岗位",
    tags: ["React", "Vue3", "TypeScript", "Tailwind"], projects: 3, practices: 180,
    curriculum: [
      { week: "第1-2周", title: "前端基础", lessons: ["HTML5/CSS3", "JavaScript ES6+", "TypeScript入门"] },
      { week: "第3-5周", title: "React精通", lessons: ["React18新特性", "自定义Hooks", "性能优化", "Next.js框架"] },
      { week: "第6-7周", title: "Vue3精通", lessons: ["Composition API", "Pinia状态管理", "Vue Router4"] },
      { week: "第8-9周", title: "工程化与部署", lessons: ["Vite构建工具", "单元测试", "CI/CD", "Vercel/阿里云部署"] },
      { week: "第10周", title: "作品集与就业", lessons: ["作品集网站开发", "技术博客搭建", "面试题精讲"] },
    ],
  },
  "backend-java": {
    name: "Java后端路径", icon: "☕", duration: "12周", level: "L0→L4",
    salary: "¥10K~20K", desc: "Spring Boot企业级开发，完成微服务项目，对接大厂后端岗",
    tags: ["Java", "Spring Boot", "MyBatis", "Redis"], projects: 2, practices: 220,
    curriculum: [
      { week: "第1-3周", title: "Java基础", lessons: ["Java核心语法", "面向对象设计", "集合与泛型", "多线程基础"] },
      { week: "第4-6周", title: "Spring生态", lessons: ["Spring Boot自动配置", "Spring MVC", "Spring Security", "MyBatis-Plus"] },
      { week: "第7-8周", title: "数据库与缓存", lessons: ["MySQL进阶查询", "Redis缓存设计", "消息队列RabbitMQ"] },
      { week: "第9-10周", title: "微服务入门", lessons: ["Spring Cloud", "服务注册与发现", "API网关"] },
      { week: "第11-12周", title: "项目实战", lessons: ["电商系统设计", "分布式事务", "性能优化", "K8s部署"] },
    ],
  },
  "data-analysis": {
    name: "数据分析路径", icon: "📊", duration: "8周", level: "L0→L3",
    salary: "¥8K~14K", desc: "Python数据分析+BI可视化，适合非CS转行数据岗",
    tags: ["Python", "Pandas", "SQL", "Tableau"], projects: 2, practices: 150,
    curriculum: [
      { week: "第1-2周", title: "Python数据基础", lessons: ["Python核心语法", "NumPy数组运算", "Pandas数据处理"] },
      { week: "第3-4周", title: "数据库与SQL", lessons: ["MySQL基础", "复杂查询优化", "数据仓库概念"] },
      { week: "第5-6周", title: "数据可视化", lessons: ["Matplotlib/Seaborn", "Tableau Desktop", "Power BI基础"] },
      { week: "第7-8周", title: "分析项目实战", lessons: ["电商数据分析项目", "用户行为分析", "分析报告撰写", "面试准备"] },
    ],
  },
};

export default function PathDetailPage({ params }: { params: { slug: string } }) {
  const path = PATH_DATA[params.slug] ?? PATH_DATA["fullstack"];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 mb-6 border border-gray-100">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-5xl">{path.icon}</span>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{path.name}</h1>
              <p className="text-gray-500 mb-4">{path.desc}</p>
              <div className="flex flex-wrap gap-2">
                {path.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-green-600">{path.salary}</div>
              <div className="text-xs text-gray-400">平均起薪</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-100 pt-6">
            <div><div className="text-lg font-bold text-gray-900">{path.duration}</div><div className="text-xs text-gray-400">学习周期</div></div>
            <div><div className="text-lg font-bold text-gray-900">{path.practices}题</div><div className="text-xs text-gray-400">编程练习</div></div>
            <div><div className="text-lg font-bold text-gray-900">{path.projects}个</div><div className="text-xs text-gray-400">真实项目</div></div>
          </div>
        </div>

        {/* Curriculum */}
        <div className="bg-white rounded-2xl p-8 mb-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">课程大纲</h2>
          <div className="space-y-4">
            {path.curriculum.map((block, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-20 text-xs text-blue-500 font-medium pt-1">{block.week}</div>
                <div className="flex-1 border-l-2 border-blue-100 pl-4">
                  <div className="font-semibold text-gray-900 mb-2">{block.title}</div>
                  <div className="flex flex-wrap gap-2">
                    {block.lessons.map((l) => (
                      <span key={l} className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded">{l}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-4">
          <Link
            href="/login"
            className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-4 rounded-xl transition-colors"
          >
            免费开始学习 →
          </Link>
          <Link
            href="/pricing"
            className="flex-1 text-center border-2 border-blue-300 text-blue-600 font-semibold px-6 py-4 rounded-xl hover:bg-blue-50 transition-colors"
          >
            查看就业保障方案
          </Link>
        </div>
      </div>
    </div>
  );
}
