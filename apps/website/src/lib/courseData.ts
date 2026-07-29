export interface CourseDetail {
  slug: string;
  title: string;
  persona: string;
  personaColor: string;
  difficulty: string;
  duration: string;
  price: number;
  originalPrice: number;
  students: number;
  guarantee: boolean;
  emoji: string;
  coverGradient: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
    bio: string;
  };
  targetAudience: string[];
  learningOutcomes: string[];
  curriculum: { week: string; title: string; topics: string[] }[];
  guaranteeDetail: {
    condition: string;
    requirements: string[];
  };
  reviews: {
    id: number;
    name: string;
    role: string;
    avatar: string;
    rating: number;
    content: string;
  }[];
  faqs: { q: string; a: string }[];
}

export const COURSE_DETAILS: Record<string, CourseDetail> = {
  "ai-engineer-bootcamp": {
    slug: "ai-engineer-bootcamp",
    title: "AI 工程师面试训练营",
    persona: "程序员",
    personaColor: "bg-blue-100 text-blue-700",
    difficulty: "进阶",
    duration: "12 周",
    price: 1999,
    originalPrice: 2999,
    students: 3240,
    guarantee: true,
    emoji: "👨‍💻",
    coverGradient: "from-blue-500 to-indigo-600",
    instructor: {
      name: "李明老师",
      title: "前字节跳动 AI 平台负责人 · 10年工程经验",
      avatar: "👨‍💻",
      bio: "曾主导多个亿级用户 AI 系统架构设计，辅导超过 200 名工程师拿到一线大厂 offer。",
    },
    targetAudience: [
      "有 1 年以上编程经验，希望转型 AI 方向的工程师",
      "正在准备 AI 岗位面试，需要系统梳理知识体系",
      "自学 AI 遇到瓶颈，需要实战项目和导师指导",
    ],
    learningOutcomes: [
      "掌握 LLM 应用开发核心技能（Prompt Engineering / RAG / Agent）",
      "独立完成 3 个企业级 AI 项目，丰富简历",
      "系统掌握算法/系统设计/行为面试答题框架",
      "获得内推机会和 offer 谈判指导",
    ],
    curriculum: [
      { week: "第 1-2 周", title: "AI 编程基础", topics: ["Prompt Engineering 实战", "OpenAI / 国产模型 API 调用", "用 AI 完成第一个真实需求"] },
      { week: "第 3-4 周", title: "AI 实战项目", topics: ["RAG 知识库系统搭建", "Function Calling 与工具集成", "Agent 应用开发"] },
      { week: "第 5-8 周", title: "面试强化", topics: ["算法高频题精讲", "系统设计方法论", "行为面试 STAR 法则"] },
      { week: "第 9-12 周", title: "求职冲刺", topics: ["简历精修与作品集包装", "模拟面试（10次+）", "内推 + offer 谈判"] },
    ],
    guaranteeDetail: {
      condition: "结业后 90 天内无 offer → 全额退款",
      requirements: ["有效学习时长 ≥ 80%", "完成 ≥ 10 次模拟面试", "提交 ≥ 3 个实战项目"],
    },
    reviews: [
      { id: 1, name: "张同学", role: "后端工程师", avatar: "👨‍💻", rating: 5, content: "对赌协议让我没有后顾之忧，课程质量超出预期，AI 面试官练习非常真实。" },
      { id: 2, name: "王同学", role: "Java 开发", avatar: "👨‍💻", rating: 5, content: "从 Java 转 AI，原本很迷茫，课程帮我系统梳理了学习路径，最后拿到了字节 offer。" },
      { id: 3, name: "刘同学", role: "前端工程师", avatar: "👨‍💻", rating: 4, content: "RAG 项目实战部分非常实用，导师答疑也很及时，推荐！" },
    ],
    faqs: [
      { q: "课程是直播还是录播？", a: "核心内容录播 + 每周直播答疑，录播可反复观看，直播回放保留。" },
      { q: "学完后真的能拿到 offer 吗？", a: "满足学习门槛的学员，90% 在结业后 3 个月内拿到 offer。未达标可申请全额退款。" },
      { q: "可以开发票吗？", a: "可以，报名后联系客服开具增值税普通发票。" },
    ],
  },
  "kids-ai-competition": {
    slug: "kids-ai-competition",
    title: "少儿 AI 编程竞赛班",
    persona: "少儿",
    personaColor: "bg-green-100 text-green-700",
    difficulty: "入门",
    duration: "16 周",
    price: 2499,
    originalPrice: 3499,
    students: 1820,
    guarantee: true,
    emoji: "👶",
    coverGradient: "from-green-500 to-emerald-600",
    instructor: {
      name: "陈老师",
      title: "NOI 金牌教练 · 10年信息学竞赛辅导经验",
      avatar: "👨‍🏫",
      bio: "辅导学生获得 NOI 奖牌 20+ 枚，省级奖项 100+，擅长激发孩子编程兴趣。",
    },
    targetAudience: [
      "6-16 岁对编程感兴趣的孩子",
      "希望参加信息学竞赛获得升学优势",
      "零基础想系统学习编程思维",
    ],
    learningOutcomes: [
      "掌握 Python / C++ 编程基础",
      "系统学习算法与数据结构核心知识",
      "具备参加省级信息学竞赛能力",
      "培养逻辑思维和解决问题能力",
    ],
    curriculum: [
      { week: "第 1-4 周", title: "编程思维启蒙", topics: ["Scratch 图形化编程", "Python 基础语法", "编程逻辑训练"] },
      { week: "第 5-8 周", title: "算法基础", topics: ["排序与查找", "递归与分治", "基础数据结构"] },
      { week: "第 9-12 周", title: "AI 应用创作", topics: ["AI 工具初体验", "简单 AI 项目制作", "创意编程作品"] },
      { week: "第 13-16 周", title: "竞赛冲刺", topics: ["竞赛真题精讲", "模拟赛训练", "考前心理辅导"] },
    ],
    guaranteeDetail: {
      condition: "参加认可竞赛未获省三等奖以上 → 全额退款",
      requirements: ["完成全部课程", "参加至少 1 次认可竞赛", "完成课后作品集"],
    },
    reviews: [
      { id: 1, name: "李妈妈", role: "小学生家长", avatar: "👩", rating: 5, content: "孩子学了半年，从零基础到拿了省二等奖，老师非常负责。" },
      { id: 2, name: "王爸爸", role: "初中生家长", avatar: "👨", rating: 5, content: "对赌协议让我们放心，孩子现在对编程很有兴趣，值得推荐。" },
      { id: 3, name: "张妈妈", role: "小学生家长", avatar: "👩", rating: 4, content: "课程节奏适中，孩子能跟上，课后答疑也很及时。" },
    ],
    faqs: [
      { q: "孩子完全没有基础可以学吗？", a: "可以，课程从零基础开始，适合 6-16 岁各年龄段。" },
      { q: "上课需要准备什么？", a: "需要一台电脑（Windows/Mac 均可），其余由老师指导安装。" },
      { q: "哪些竞赛算认可竞赛？", a: "NOI、NOIP、CSP、省市级信息学联赛均认可。" },
    ],
  },
  "campus-zero-to-job": {
    slug: "campus-zero-to-job",
    title: "大学生零基础就业班",
    persona: "大学生",
    personaColor: "bg-purple-100 text-purple-700",
    difficulty: "入门",
    duration: "6 个月",
    price: 3999,
    originalPrice: 5999,
    students: 2150,
    guarantee: true,
    emoji: "🎓",
    coverGradient: "from-purple-500 to-violet-600",
    instructor: {
      name: "赵老师",
      title: "前阿里 P8 技术专家 · 校招面试官",
      avatar: "👨‍💻",
      bio: "10 年互联网大厂经验，参与校招面试 500+ 人，深谙企业用人标准和面试技巧。",
    },
    targetAudience: [
      "在校大学生，希望毕业即就业",
      "非计算机专业想转行互联网",
      "简历空白、缺乏项目经验",
    ],
    learningOutcomes: [
      "掌握 Web 全栈开发 + AI 应用开发核心技能",
      "完成 3 个企业级作品集项目",
      "系统准备技术面试，拿到满意 offer",
      "获得简历优化和内推资源",
    ],
    curriculum: [
      { week: "第 1-4 周", title: "编程基础 + Git + Linux", topics: ["Python/Java 基础", "Git 版本控制", "Linux 常用命令"] },
      { week: "第 5-8 周", title: "Web 全栈基础", topics: ["HTML/CSS/JS", "React 前端框架", "Node.js 后端入门"] },
      { week: "第 9-16 周", title: "AI 应用开发实战", topics: ["LLM 应用开发", "RAG 项目实战", "Agent 项目开发"] },
      { week: "第 17-24 周", title: "求职辅导", topics: ["简历打磨", "模拟面试 10 次+", "内推 + offer 谈判"] },
    ],
    guaranteeDetail: {
      condition: "毕业后 180 天内未就业 → 全额退款",
      requirements: ["完成 3 个作品集项目", "参加 10 次以上模拟面试", "有效学习时长 ≥ 80%"],
    },
    reviews: [
      { id: 1, name: "陈同学", role: "文科转码", avatar: "🎓", rating: 5, content: "我是零基础学 AI 应用开发的，老师讲得很系统，最后拿到了两个实习 offer。" },
      { id: 2, name: "吴同学", role: "大三学生", avatar: "🎓", rating: 5, content: "对赌协议给了我信心，就算失败也不亏，结果真的找到了工作。" },
      { id: 3, name: "周同学", role: "毕业生", avatar: "🎓", rating: 4, content: "项目实战部分非常实用，面试时项目经验被问到很多。" },
    ],
    faqs: [
      { q: "非 CS 专业可以学吗？", a: "完全可以，课程从零开始，已有数百名文科/理科生转行成功。" },
      { q: "需要自己有电脑吗？", a: "需要，建议配置 8GB 内存以上 Windows/Mac 电脑。" },
      { q: "课程是直播还是录播？", a: "核心录播 + 每周直播答疑，可反复观看。" },
    ],
  },
  "teacher-ai-tools": {
    slug: "teacher-ai-tools",
    title: "教师 AI 备课效率课",
    persona: "老师",
    personaColor: "bg-yellow-100 text-yellow-700",
    difficulty: "入门",
    duration: "4 周",
    price: 399,
    originalPrice: 699,
    students: 4300,
    guarantee: true,
    emoji: "👨‍🏫",
    coverGradient: "from-yellow-500 to-amber-600",
    instructor: {
      name: "孙老师",
      title: "教育部 AI 教育课题组成员 · 特级教师",
      avatar: "👨‍🏫",
      bio: "20 年一线教学经验，专注 AI 与教育融合，培训教师超过 5000 名。",
    },
    targetAudience: [
      "中小学各学科任课教师",
      "希望提升备课效率的教育工作者",
      "学校 AI 教育负责人",
    ],
    learningOutcomes: [
      "掌握 5+ 款教师常用 AI 工具",
      "用 AI 完成一周完整教案",
      "AI 辅助出题和批阅作业",
      "制作 AI 增强型课件",
    ],
    curriculum: [
      { week: "第 1 周", title: "AI 工具快速上手", topics: ["ChatGPT / Kimi 使用技巧", "AI 写作助手", "AI 图片生成"] },
      { week: "第 2 周", title: "AI 备课实战", topics: ["用 AI 写教案", "AI 生成课件", "学科专属案例"] },
      { week: "第 3 周", title: "AI 出题 + 批改", topics: ["自动出题系统", "AI 辅助批阅", "个性化作业"] },
      { week: "第 4 周", title: "AI 课件 + 班级管理", topics: ["AI 增强课件制作", "班级管理自动化", "成果展示"] },
    ],
    guaranteeDetail: {
      condition: "课后工具使用低于 50 次，自评效率无提升 → 全额退款",
      requirements: ["连续 30 天使用 AI 工具", "完成 3 个 AI 备课案例", "提交课后实践报告"],
    },
    reviews: [
      { id: 1, name: "李老师", role: "初中语文", avatar: "👩‍🏫", rating: 5, content: "用 AI 备课效率提升 70%，每周节省 15 小时，还开设了校本 AI 课程。" },
      { id: 2, name: "王老师", role: "小学数学", avatar: "👨‍🏫", rating: 5, content: "以前觉得 AI 是程序员的事，学完才发现教师用好 AI 收益更大。" },
      { id: 3, name: "张老师", role: "高中英语", avatar: "👩‍🏫", rating: 4, content: "课程专门针对教师场景设计，非常实用，推荐！" },
    ],
    faqs: [
      { q: "不懂技术能学吗？", a: "完全不需要编程基础，课程专注工具使用，小学老师也能轻松上手。" },
      { q: "适合哪些学科老师？", a: "语文、数学、英语、理科均有专属案例，综合课/班主任同样适用。" },
      { q: "学完后工具还能用吗？", a: "永久使用萌牛AI教师专属工具包。" },
    ],
  },
  "creator-ai-writing": {
    slug: "creator-ai-writing",
    title: "自媒体 AI 创作涨粉课",
    persona: "自媒体",
    personaColor: "bg-pink-100 text-pink-700",
    difficulty: "入门",
    duration: "6 周",
    price: 499,
    originalPrice: 899,
    students: 3670,
    guarantee: true,
    emoji: "📱",
    coverGradient: "from-pink-500 to-rose-600",
    instructor: {
      name: "马老师",
      title: "百万粉丝自媒体操盘手 · AI 内容创作顾问",
      avatar: "👨‍💻",
      bio: "运营多个百万级账号，专注 AI 内容提效，辅导 1000+ 创作者实现涨粉目标。",
    },
    targetAudience: [
      "公众号/小红书/视频号运营者",
      "希望用 AI 提升内容产出效率",
      "账号粉丝增长遇到瓶颈",
    ],
    learningOutcomes: [
      "掌握 AI 选题与爆款分析方法",
      "用 AI 实现日产优质内容",
      "全媒体内容生产提速 3-5 倍",
      "3 个月增粉 500+",
    ],
    curriculum: [
      { week: "第 1-2 周", title: "AI 选题与爆款分析", topics: ["爆款选题方法论", "AI 数据分析工具", "竞品分析"] },
      { week: "第 3-4 周", title: "AI 写作实战", topics: ["AI 写作工作流", "多平台内容适配", "标题与排版"] },
      { week: "第 5-6 周", title: "AI 配图 + 视频脚本", topics: ["AI 图片生成", "视频脚本创作", "全媒体矩阵"] },
    ],
    guaranteeDetail: {
      condition: "结课 3 个月内增粉不足 500 → 全额退款",
      requirements: ["课程期间产出内容 ≥ 30 篇", "完成选题+写作+发布完整流程", "有效学习时长 ≥ 80%"],
    },
    reviews: [
      { id: 1, name: "赵女士", role: "宝妈博主", avatar: "👩", rating: 5, content: "AI 工具帮我从选题到排版全流程提速，每天只需 1 小时。" },
      { id: 2, name: "钱先生", role: "小红书博主", avatar: "👨", rating: 5, content: "3 个月增粉 1200+，阅读量翻 3 倍，课程超值。" },
      { id: 3, name: "孙同学", role: "公众号运营", avatar: "👩", rating: 4, content: "AI 选题方法很实用，内容质量明显提升。" },
    ],
    faqs: [
      { q: "做哪些平台的适合学？", a: "微信公众号、小红书、视频号、抖音、知乎均有专项策略。" },
      { q: "增粉 500 如何计算？", a: "以结课时粉丝数为基准，3 个月后增量不足 500（各平台合计），可申请退款。" },
      { q: "没有账号怎么办？", a: "课程包含账号从零起步模块，讲师协助定位账号方向。" },
    ],
  },
  "rag-agent-dev": {
    slug: "rag-agent-dev",
    title: "RAG + Agent 实战开发",
    persona: "程序员",
    personaColor: "bg-blue-100 text-blue-700",
    difficulty: "高级",
    duration: "8 周",
    price: 1299,
    originalPrice: 1999,
    students: 980,
    guarantee: false,
    emoji: "🤖",
    coverGradient: "from-indigo-500 to-purple-600",
    instructor: {
      name: "黄老师",
      title: "AI 架构师 · 开源项目作者",
      avatar: "👨‍💻",
      bio: "主导多个企业级 AI 平台架构，开源项目 Star 数 5000+，深谙 RAG 和 Agent 技术栈。",
    },
    targetAudience: [
      "有 Python 基础，希望深入 AI 应用开发",
      "想系统学习 RAG 和 Agent 技术栈",
      "准备 AI 岗位高级面试",
    ],
    learningOutcomes: [
      "深入理解 RAG 原理与优化技巧",
      "掌握 Agent 架构设计与工具调用",
      "独立完成企业级 AI 应用项目",
      "具备 AI 架构师面试能力",
    ],
    curriculum: [
      { week: "第 1-2 周", title: "RAG 深入", topics: ["向量检索与 Embedding", "RAG 评估与优化", "多路召回策略"] },
      { week: "第 3-4 周", title: "Agent 架构", topics: ["ReAct / Plan-and-Execute", "工具调用设计", "多 Agent 协作"] },
      { week: "第 5-6 周", title: "工程化实战", topics: ["LLM 应用部署", "监控与评估", "性能优化"] },
      { week: "第 7-8 周", title: "综合项目", topics: ["企业级 AI 平台搭建", "项目答辩", "简历包装"] },
    ],
    guaranteeDetail: {
      condition: "本课程为高级技术课，不设对赌",
      requirements: [],
    },
    reviews: [
      { id: 1, name: "陈同学", role: "AI 工程师", avatar: "👨‍💻", rating: 5, content: "RAG 优化部分非常深入，项目实战贴近企业真实场景。" },
      { id: 2, name: "吴同学", role: "后端开发", avatar: "👨‍💻", rating: 5, content: "Agent 架构设计讲得很清晰，对我的工作帮助很大。" },
      { id: 3, name: "郑同学", role: "算法工程师", avatar: "👨‍💻", rating: 4, content: "课程难度适中偏上，需要一定基础，值得推荐。" },
    ],
    faqs: [
      { q: "需要什么基础？", a: "需要 Python 基础，了解基本机器学习概念更佳。" },
      { q: "有对赌协议吗？", a: "本课程为高级技术课，不设对赌，但提供完整答疑服务。" },
      { q: "学完能到什么水平？", a: "具备独立设计和开发企业级 AI 应用的能力。" },
    ],
  },
  "business-ai-marketing": {
    slug: "business-ai-marketing",
    title: "小老板 AI 获客引流课",
    persona: "小老板",
    personaColor: "bg-orange-100 text-orange-700",
    difficulty: "入门",
    duration: "4 周",
    price: 299,
    originalPrice: 499,
    students: 2100,
    guarantee: true,
    emoji: "🏪",
    coverGradient: "from-orange-500 to-red-500",
    instructor: {
      name: "周老师",
      title: "本地生活营销专家 · AI 运营顾问",
      avatar: "👨‍💻",
      bio: "服务 500+ 本地门店，专注 AI 营销提效，帮助小老板用最简单的方法获客。",
    },
    targetAudience: [
      "餐饮、美业、零售等本地生活门店老板",
      "个体经营者、小微企业主",
      "完全不懂 AI 但想尝试的创业者",
    ],
    learningOutcomes: [
      "当天就能用 AI 写朋友圈文案",
      "建立门店内容矩阵",
      "完整获客系统跑通",
      "客流明显提升",
    ],
    curriculum: [
      { week: "第 1 周", title: "AI 工具 0 基础入门", topics: ["AI 工具注册与基础操作", "语音输入写文案", "朋友圈文案模板"] },
      { week: "第 2 周", title: "AI 获客内容策略", topics: ["门店内容矩阵搭建", "小红书/抖音内容", "本地引流方法"] },
      { week: "第 3-4 周", title: "私域 + 直播 + 本地引流", topics: ["私域运营", "AI 直播辅助", "完整获客系统"] },
    ],
    guaranteeDetail: {
      condition: "完成课程 30 次实操后自评无效 → 全额退款",
      requirements: ["完成课程全部模块", "产出 30 个以上 AI 营销内容", "真实用于门店运营"],
    },
    reviews: [
      { id: 1, name: "刘老板", role: "餐饮店主", avatar: "👨", rating: 5, content: "完全不懂 AI，老师手把手教，现在每天自己用 AI 写文案。" },
      { id: 2, name: "王老板", role: "美业店主", avatar: "👩", rating: 5, content: "用 AI 做朋友圈内容 1 个月，到店客流增加 30%。" },
      { id: 3, name: "李老板", role: "零售店主", avatar: "👨", rating: 4, content: "课程简单实用，对小店老板很友好。" },
    ],
    faqs: [
      { q: "不会打字能学吗？", a: "会用手机就能学，课程有大量截图和视频教程，语音输入即可。" },
      { q: "需要花钱买 AI 工具吗？", a: "课程使用的工具均有免费版，基础功能完全够用。" },
      { q: "哪些行业适合学？", a: "餐饮、美业、零售、服务业、教培等本地生活类门店均适合。" },
    ],
  },
};

export const ALL_COURSES = Object.values(COURSE_DETAILS);
