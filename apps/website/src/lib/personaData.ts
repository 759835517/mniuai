// 通用人群落地页数据类型和工具
export interface PersonaPageData {
  slug: string;
  icon: string;
  title: string;
  heroTitle: string;
  heroSubtitle: string;
  pains: string[];
  guarantee: {
    condition: string;
    requirements: string[];
  };
  timeline: { week: string; topic: string; goal: string }[];
  appUrl: string;
  ctaText: string;
  faqs: { q: string; a: string }[];
}

export const PERSONA_DATA: Record<string, PersonaPageData> = {
  engineer: {
    slug: "engineer",
    icon: "👨‍💻",
    title: "程序员AI训练营",
    heroTitle: "90 天，从传统开发到 AI 工程师，找不到工作全额退款",
    heroSubtitle: "系统学习 AI 编程实战 + 面试强化，彻底打通 AI 转型通道",
    pains: [
      "自学 AI 方向不明，看了很多教程还是不知道从哪下手",
      "面试卡在算法题和系统设计，投了 50 份简历石沉大海",
      "公司要求 AI 能力，但不知道如何把 AI 用在真实项目中",
    ],
    guarantee: {
      condition: "结业后 90 天内无 offer → 全额退款",
      requirements: ["有效学习时长 ≥ 80%", "完成 ≥ 10 次模拟面试", "提交 ≥ 3 个实战项目"],
    },
    timeline: [
      { week: "第 1-2 周", topic: "AI 编程基础", goal: "用 AI 完成第一个真实需求" },
      { week: "第 3-4 周", topic: "AI 实战项目", goal: "独立完成 RAG/Agent 应用" },
      { week: "第 5-8 周", topic: "面试强化", goal: "算法/系统设计/行为面试通关" },
      { week: "第 9-12 周", topic: "求职冲刺", goal: "简历优化 + 内推 + offer 谈判" },
    ],
    appUrl: process.env.NEXT_PUBLIC_ENGINEER_APP_URL || "https://app.mniuai.com",
    ctaText: "立即报名，0 风险开始",
    faqs: [
      { q: "没有 AI 基础可以学吗？", a: "可以，课程从 AI 工具使用开始，循序渐进进入开发实战。" },
      { q: "对赌协议如何判断「没找到工作」？", a: "结业后 90 天内未收到书面 offer，且满足学习门槛，可申请全额退款。" },
      { q: "学的技术会过时吗？", a: "课程每季度更新，追踪最新模型和框架，已购学员永久免费获得更新内容。" },
    ],
  },
  kids: {
    slug: "kids",
    icon: "👶",
    title: "少儿AI编程",
    heroTitle: "让孩子赢在 AI 时代，竞赛获奖或退款",
    heroSubtitle: "专业教研团队设计，覆盖 NOI / 信息学竞赛 / AI 应用创作全路径",
    pains: [
      "孩子学了编程，但不知道怎么和 AI 结合提升竞赛成绩",
      "市面上少儿编程课质量参差不齐，不知道哪家靠谱",
      "担心学了不用，花了钱没效果",
    ],
    guarantee: {
      condition: "参加认可竞赛未获省三等奖以上 → 全额退款",
      requirements: ["完成全部课程", "参加至少 1 次认可竞赛", "完成课后作品集"],
    },
    timeline: [
      { week: "第 1-4 周", topic: "编程思维启蒙", goal: "掌握基本编程逻辑和 Scratch/Python" },
      { week: "第 5-8 周", topic: "算法基础", goal: "排序/递归/数据结构基础题通关" },
      { week: "第 9-12 周", topic: "AI 应用创作", goal: "独立完成一个 AI 小项目" },
      { week: "第 13-16 周", topic: "竞赛冲刺", goal: "模拟题训练 + 赛前心理辅导" },
    ],
    appUrl: process.env.NEXT_PUBLIC_KIDS_APP_URL || "https://kids.mniuai.com",
    ctaText: "立即为孩子报名",
    faqs: [
      { q: "适合几岁的孩子？", a: "6-16 岁均可，根据年龄分班，小学启蒙班/初中竞赛班/高中提升班。" },
      { q: "上课形式是什么？", a: "在线直播课 + 录播回放 + 1v1 辅导答疑，家长可陪同观看。" },
      { q: "哪些竞赛算认可竞赛？", a: "NOI、NOIP、CSP、省市级信息学联赛均认可，报名前会确认竞赛计划。" },
    ],
  },
  campus: {
    slug: "campus",
    icon: "🎓",
    title: "大学生零基础就业",
    heroTitle: "大学毕业直接就业，6 个月内找到工作",
    heroSubtitle: "专为在校大学生设计，零基础系统学习 AI 应用开发，保障就业",
    pains: [
      "计算机专业课理论多实践少，毕业后感觉什么都不会",
      "非计算机专业转行，不知道从哪里入手",
      "投了很多简历，技术面试完全不知道怎么答",
    ],
    guarantee: {
      condition: "毕业后 180 天内未就业 → 全额退款",
      requirements: ["完成 3 个作品集项目", "参加 10 次以上模拟面试", "有效学习时长 ≥ 80%"],
    },
    timeline: [
      { week: "第 1-4 周", topic: "编程基础 + Git + Linux", goal: "独立搭建开发环境" },
      { week: "第 5-8 周", topic: "Web 全栈基础", goal: "完成第一个全栈小项目" },
      { week: "第 9-16 周", topic: "AI 应用开发实战", goal: "完成 RAG/Agent 作品集项目" },
      { week: "第 17-24 周", topic: "求职辅导", goal: "简历打磨 + 面试通关 + offer 拿到手" },
    ],
    appUrl: process.env.NEXT_PUBLIC_CAMPUS_APP_URL || "https://campus.mniuai.com",
    ctaText: "立即开启就业之路",
    faqs: [
      { q: "非 CS 专业可以学吗？", a: "完全可以，课程从零开始，已有数百名文科/理科生转行成功。" },
      { q: "「180天未就业」的界定？", a: "毕业日起 180 天，未获得全职工作 offer，且满足学习门槛，可申请退款。" },
      { q: "需要自己有电脑吗？", a: "需要，建议配置 8GB 内存以上 Windows/Mac 电脑，开发环境由导师协助配置。" },
    ],
  },
  teacher: {
    slug: "teacher",
    icon: "👨‍🏫",
    title: "教师AI助手课",
    heroTitle: "AI 帮你备课，每周省出 10 小时",
    heroSubtitle: "专为中小学、高校教师设计，快速上手 AI 备课、出题、批改全流程",
    pains: [
      "备课和出题占据大量时间，没时间做创意教学和学生辅导",
      "尝试过 ChatGPT，但不知道如何用在具体教学场景",
      "学校要求开展 AI 教育，自己对 AI 一无所知，很焦虑",
    ],
    guarantee: {
      condition: "课后工具使用低于 50 次，自评效率无提升 → 全额退款",
      requirements: ["连续 30 天使用 AI 工具", "完成 3 个 AI 备课案例", "提交课后实践报告"],
    },
    timeline: [
      { week: "第 1 周", topic: "AI 工具快速上手", goal: "掌握 3 款教师常用 AI 工具" },
      { week: "第 2 周", topic: "AI 备课实战", goal: "用 AI 完成一周完整教案" },
      { week: "第 3 周", topic: "AI 出题 + 批改", goal: "自动生成题库，AI 辅助批阅" },
      { week: "第 4 周", topic: "AI 课件 + 班级管理", goal: "制作 AI 增强课件，掌握全流程" },
    ],
    appUrl: process.env.NEXT_PUBLIC_EDU_APP_URL || "https://edu.mniuai.com",
    ctaText: "立即开始提效",
    faqs: [
      { q: "不懂技术能学吗？", a: "完全不需要编程基础，课程专注工具使用，小学老师也能轻松上手。" },
      { q: "适合哪些学科老师？", a: "语文、数学、英语、理科均有专属案例，综合课/班主任同样适用。" },
      { q: "学完后有哪些工具可以用？", a: "永久使用萌牛AI教师专属工具包，包括备课助手、出题机、批改机、PPT 生成等。" },
    ],
  },
  creator: {
    slug: "creator",
    icon: "📱",
    title: "自媒体AI创作课",
    heroTitle: "AI 助力涨粉，3 个月增粉 500",
    heroSubtitle: "公众号/小红书/视频号运营者专属，用 AI 降低创作成本，提升内容质量",
    pains: [
      "每篇文章要花 3-5 小时，选题/写作/配图都很费时",
      "账号发了 100 篇，粉丝还不到 500，不知道问题在哪",
      "AI 工具太多，不知道哪些真的有用",
    ],
    guarantee: {
      condition: "结课 3 个月内增粉不足 500 → 全额退款",
      requirements: ["课程期间产出内容 ≥ 30 篇", "完成选题+写作+发布完整流程", "有效学习时长 ≥ 80%"],
    },
    timeline: [
      { week: "第 1-2 周", topic: "AI 选题与爆款分析", goal: "掌握数据驱动选题方法" },
      { week: "第 3-4 周", topic: "AI 写作实战", goal: "用 AI 日产优质内容" },
      { week: "第 5-6 周", topic: "AI 配图 + 视频脚本", goal: "全媒体内容生产提速" },
    ],
    appUrl: process.env.NEXT_PUBLIC_PRO_APP_URL || "https://pro.mniuai.com",
    ctaText: "立即开始创作",
    faqs: [
      { q: "做哪些平台的适合学？", a: "微信公众号、小红书、视频号、抖音、知乎均有专项策略，均适合。" },
      { q: "增粉 500 如何计算？", a: "以结课时粉丝数为基准，3 个月后增量不足 500（各平台合计），可申请退款。" },
      { q: "如果我没有账号怎么办？", a: "课程包含账号从零起步模块，讲师协助定位账号方向和冷启动策略。" },
    ],
  },
  business: {
    slug: "business",
    icon: "🏪",
    title: "小老板AI获客",
    heroTitle: "门店用 AI 获客，一个月见效",
    heroSubtitle: "实体店/服务业小老板专属，用 AI 做朋友圈文案、引流内容、私域运营",
    pains: [
      "门店越来越难获客，传统发传单做广告效果越来越差",
      "看到别人用 AI 做营销内容，自己完全不会用",
      "没有时间学习，需要立刻能用的工具和方法",
    ],
    guarantee: {
      condition: "完成课程 30 次实操后自评无效 → 全额退款",
      requirements: ["完成课程全部模块", "产出 30 个以上 AI 营销内容", "真实用于门店运营"],
    },
    timeline: [
      { week: "第 1 周", topic: "AI 工具 0 基础入门", goal: "当天就能用 AI 写朋友圈文案" },
      { week: "第 2 周", topic: "AI 获客内容策略", goal: "建立门店内容矩阵" },
      { week: "第 3-4 周", topic: "私域 + 直播 + 本地引流", goal: "完整获客系统跑通" },
    ],
    appUrl: process.env.NEXT_PUBLIC_PRO_APP_URL || "https://pro.mniuai.com",
    ctaText: "立即开始获客",
    faqs: [
      { q: "哪些行业适合学？", a: "餐饮、美业、零售、服务业、教培等本地生活类门店均适合。" },
      { q: "不会打字能学吗？", a: "会用手机就能学，课程有大量截图和视频教程，语音输入即可使用 AI。" },
      { q: "需要花钱买 AI 工具吗？", a: "课程使用的工具均有免费版，基础功能完全够用，不强制付费。" },
    ],
  },
};
