export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  emoji: string;
  persona: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  coverGradient: string;
  excerpt: string;
  content: string;
  tags: string[];
  relatedPersonaSlug?: string;
}

export const BLOG_POSTS: Record<string, BlogPost> = {
  "ai-programming-guide-2026": {
    slug: "ai-programming-guide-2026",
    title: "2026年AI编程完全指南：从入门到上岗",
    category: "AI工具教程",
    date: "2026-07-20",
    readTime: "8分钟",
    emoji: "💻",
    persona: "程序员",
    author: { name: "李明老师", role: "前字节跳动 AI 平台负责人", avatar: "👨‍💻" },
    coverGradient: "from-blue-500 to-indigo-600",
    excerpt: "2026年，AI 编程已经从可选项变成了必选项。本文将带你系统了解 AI 编程的完整学习路径，从工具使用到项目实战，帮你少走弯路。",
    content: `
## 为什么2026年必须学 AI 编程？

2026年，AI 编程已经不是"要不要学"的问题，而是"不学就被淘汰"的现实。各大厂在招聘时，AI 能力已经成为核心考察点。

### 1. AI 编程的三大核心技能

**Prompt Engineering（提示词工程）**：这是 AI 编程的基础。好的提示词能让 AI 输出质量提升 3-5 倍。

**RAG（检索增强生成）**：让 AI 能够基于你的私有知识库回答问题，是企业 AI 应用的标配。

**Agent（智能体）**：让 AI 具备自主规划和执行能力，是 2026 年最热门的技术方向。

### 2. 学习路径建议

| 阶段 | 时间 | 目标 |
|---|---|---|
| 入门 | 2 周 | 熟练使用 AI 编程工具 |
| 进阶 | 1-2 月 | 独立完成 RAG 项目 |
| 高级 | 3-6 月 | 掌握 Agent 开发 |

### 3. 常见误区

- ❌ 过度依赖 AI，不自己思考
- ❌ 只看教程，不做项目
- ❌ 追新工具，不深入理解原理

### 4. 萌牛AI 的学习建议

萌牛AI 的 AI 工程师训练营采用"项目驱动 + 对赌保障"模式，帮助你在 90 天内系统掌握 AI 编程核心技能。
    `,
    tags: ["AI编程", "Prompt Engineering", "RAG", "Agent", "学习路径"],
    relatedPersonaSlug: "engineer",
  },
  "teacher-ai-lesson-prep": {
    slug: "teacher-ai-lesson-prep",
    title: "教师如何用AI备课？5个真实场景实操教程",
    category: "AI工具教程",
    date: "2026-07-18",
    readTime: "6分钟",
    emoji: "📚",
    persona: "老师",
    author: { name: "孙老师", role: "教育部 AI 教育课题组成员", avatar: "👨‍🏫" },
    coverGradient: "from-yellow-500 to-amber-600",
    excerpt: "备课、出题、批改、做课件...教师的大量时间被重复工作占据。本文分享 5 个 AI 辅助教学的真实场景，帮你每周节省 10+ 小时。",
    content: `
## 场景一：AI 写教案

传统写教案需要 2-3 小时，用 AI 辅助可以压缩到 30 分钟。

**操作步骤**：
1. 告诉 AI 你的学科、年级、课程主题
2. 让 AI 生成教案初稿
3. 你根据经验调整细节

## 场景二：AI 出题

AI 可以根据知识点自动生成题目，支持选择题、填空题、简答题。

**优势**：
- 题目难度可控
- 自动生成答案解析
- 支持批量生成

## 场景三：AI 批改作业

AI 可以辅助批改客观题，主观题也能给出参考评分建议。

## 场景四：AI 制作课件

用 AI 生成 PPT 大纲，再配合 AI 图片生成工具，快速制作精美课件。

## 场景五：AI 班级管理

AI 可以帮助你：
- 生成家长会发言稿
- 撰写学生评语
- 设计班级活动方案

## 萌牛AI 教师专属工具

萌牛AI 为教师量身打造了 AI 备课工具包，覆盖以上所有场景，简单易用，无需技术基础。
    `,
    tags: ["教师AI", "AI备课", "AI出题", "AI批改", "教学提效"],
    relatedPersonaSlug: "teacher",
  },
  "rag-agent-intro": {
    slug: "rag-agent-intro",
    title: "RAG 和 Agent 有什么区别？一文搞懂",
    category: "技术深度",
    date: "2026-07-15",
    readTime: "12分钟",
    emoji: "🤖",
    persona: "程序员",
    author: { name: "黄老师", role: "AI 架构师 · 开源项目作者", avatar: "👨‍💻" },
    coverGradient: "from-indigo-500 to-purple-600",
    excerpt: "RAG 和 Agent 是 2026 年 AI 应用开发的两大核心技术。本文用通俗的语言和真实案例，帮你彻底搞清楚它们的区别和应用场景。",
    content: `
## RAG 是什么？

RAG（Retrieval-Augmented Generation，检索增强生成）是一种让 AI 基于外部知识库回答问题的技术。

**工作原理**：
1. 用户提问
2. 系统从知识库检索相关内容
3. 将检索结果 + 问题一起发给 AI
4. AI 基于这些信息生成回答

**适用场景**：
- 企业知识库问答
- 文档助手
- 客服机器人

## Agent 是什么？

Agent（智能体）是具备自主规划和执行能力的 AI 系统。

**核心能力**：
- 任务分解
- 工具调用
- 自我反思和纠错

**适用场景**：
- 自动化工作流
- 复杂任务执行
- 多步骤推理

## 核心区别

| 维度 | RAG | Agent |
|---|---|---|
| 核心能力 | 检索 + 生成 | 规划 + 执行 |
| 交互方式 | 单次问答 | 多步骤任务 |
| 复杂度 | 中等 | 较高 |
| 适用场景 | 知识问答 | 任务自动化 |

## 如何选择？

- 如果你的需求是"让 AI 回答特定领域问题"→ 选 RAG
- 如果你的需求是"让 AI 自动完成复杂任务"→ 选 Agent
- 实际项目中，两者经常结合使用

## 萌牛AI 实战课程

萌牛AI 的 RAG + Agent 实战开发课程，带你从零搭建企业级 AI 应用。
    `,
    tags: ["RAG", "Agent", "AI应用开发", "技术深度", "架构设计"],
    relatedPersonaSlug: "engineer",
  },
  "xiaohongshu-ai-strategy": {
    slug: "xiaohongshu-ai-strategy",
    title: "小红书用AI运营涨粉实战：3个月真实数据分享",
    category: "学员故事",
    date: "2026-07-12",
    readTime: "5分钟",
    emoji: "📱",
    persona: "自媒体",
    author: { name: "赵女士", role: "宝妈博主 · 萌牛AI 学员", avatar: "👩" },
    coverGradient: "from-pink-500 to-rose-600",
    excerpt: "从 800 粉丝到 2000+，我用 AI 做小红书运营，3 个月实现了真实涨粉。以下是我的完整经验分享。",
    content: `
## 背景

我是一名宝妈，运营小红书 2 年，粉丝一直停留在 800 左右。每篇文章要花 3-5 小时，效果却不理想。

## 转变：用 AI 重新设计工作流

### 1. AI 选题

用 AI 分析爆款笔记的共性，找到高潜力选题方向。

### 2. AI 写初稿

AI 根据选题生成初稿，我只需要修改润色，时间从 2 小时压缩到 30 分钟。

### 3. AI 生成配图

用 AI 生成封面图和插图，视觉效果明显提升。

### 4. AI 优化标题和标签

AI 分析热门标题结构，帮我优化标题和标签。

## 3 个月数据变化

| 指标 | 学之前 | 3 个月后 |
|---|---|---|
| 粉丝数 | 800 | 2,100+ |
| 篇均阅读 | 500 | 2,000+ |
| 篇均点赞 | 30 | 150+ |
| 单篇耗时 | 3-5 小时 | 1 小时 |

## 关键心得

1. **AI 不是替代你，而是放大你的能力**
2. **内容质量永远是核心，AI 只是提效工具**
3. **坚持输出，AI 帮你降低输出成本**

## 萌牛AI 自媒体课程

如果你想系统学习 AI 内容创作，萌牛AI 的自媒体 AI 创作课提供完整的工作流教学和 1v1 辅导。
    `,
    tags: ["小红书", "AI运营", "涨粉", "自媒体", "学员故事"],
    relatedPersonaSlug: "creator",
  },
  "campus-student-ai-job": {
    slug: "campus-student-ai-job",
    title: "非CS专业大学生如何用AI转行互联网？",
    category: "学员故事",
    date: "2026-07-10",
    readTime: "7分钟",
    emoji: "🎓",
    persona: "大学生",
    author: { name: "陈同学", role: "文科转码 · 萌牛AI 学员", avatar: "🎓" },
    coverGradient: "from-purple-500 to-violet-600",
    excerpt: "我是中文系大三学生，通过 6 个月系统学习 AI 应用开发，拿到了两个互联网实习 offer。以下是我的转行经验。",
    content: `
## 背景

我是中文系大三学生，原本对未来很迷茫。一次偶然接触到 AI 应用开发，发现不需要深厚的编程基础也能做出有趣的产品。

## 学习路径

### 第 1-2 月：打基础

- Python 基础语法
- Git 版本控制
- 基本命令行操作

### 第 3-4 月：学核心

- AI 工具使用（ChatGPT / Kimi）
- RAG 基础概念
- 简单 AI 应用开发

### 第 5-6 月：做项目

- 完成 3 个作品集项目
- 准备简历和面试
- 参加模拟面试

## 关键心得

1. **不要怕起点低**：我学中文的也能学会
2. **项目比证书重要**：3 个项目比任何证书都有说服力
3. **对赌协议给了我信心**：学不会全额退款，没有后顾之忧

## 给学弟学妹的建议

- 不要等到毕业才开始准备
- 利用好大学时间，多做项目
- 找一个好的学习平台，少走弯路

## 萌牛AI 大学生就业班

专为在校大学生设计，零基础系统学习 AI 应用开发，保障就业。
    `,
    tags: ["大学生", "转行", "AI就业", "学员故事", "零基础"],
    relatedPersonaSlug: "campus",
  },
  "ai-tools-comparison-2026": {
    slug: "ai-tools-comparison-2026",
    title: "2026最全AI写作工具对比：Kimi / ChatGPT / Claude",
    category: "工具对比",
    date: "2026-07-08",
    readTime: "10分钟",
    emoji: "⚖️",
    persona: "全部",
    author: { name: "马老师", role: "百万粉丝自媒体操盘手", avatar: "👨‍💻" },
    coverGradient: "from-gray-600 to-gray-800",
    excerpt: "2026年，AI 写作工具层出不穷。本文深度对比 Kimi、ChatGPT、Claude 三大主流工具，帮你找到最适合自己的那一款。",
    content: `
## 测评维度

我们从以下维度进行对比：
- 中文能力
- 长文本处理
- 写作质量
- 价格
- 特色功能

## Kimi（月之暗面）

**优势**：
- 超长上下文（200 万字）
- 中文能力强
- 支持文件上传

**适合场景**：长文档分析、中文写作

## ChatGPT（OpenAI）

**优势**：
- 功能最全面
- 插件生态丰富
- 多模态能力强

**适合场景**：通用写作、代码辅助、创意生成

## Claude（Anthropic）

**优势**：
- 写作质量高
- 逻辑推理强
- 安全性好

**适合场景**：长文写作、分析推理、学术写作

## 对比总结

| 工具 | 中文 | 长文本 | 写作 | 价格 | 推荐场景 |
|---|---|---|---|---|---|
| Kimi | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 中等 | 中文长文档 |
| ChatGPT | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | 较高 | 通用全能 |
| Claude | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 较高 | 高质量写作 |

## 使用建议

- 没有绝对的好坏，只有适不适合
- 可以组合使用，发挥各自优势
- 萌牛AI 课程会教你如何高效使用这些工具
    `,
    tags: ["AI写作", "Kimi", "ChatGPT", "Claude", "工具对比"],
  },
};

export const ALL_BLOG_POSTS = Object.values(BLOG_POSTS);
