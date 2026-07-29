// ============================================================
// Mock Data for MNIU AI Camp
// When NEXT_PUBLIC_ENABLE_MOCK=true, API calls return mock data.
// ============================================================
import type { User } from "@/lib/types/user";
import type { LearningRoadmap, RoadmapProgress } from "@/lib/types/roadmap";
import type { ChatSession, ChatMessage } from "@/lib/types/coach";
import type { Project } from "@/lib/types/project";
import type { CodeReview } from "@/lib/types/review";
import type { GrowthProfile, Achievement, NotificationItem, GrowthStats } from "@/lib/types/growth";
import type { CourseSummary, CourseDetail, PlayUrlResponse, ProgressSnapshot } from "@/lib/types/course";
import type { ArticleSummary, ArticleDetail } from "@/lib/types/article";
import type { InterviewQuestion, InterviewSet, MockInterview, InterviewSkillProfile } from "@/lib/types/interview";
import type { Exam, ExamQuestion, ExamRecord, MasterySummary } from "@/lib/types/quiz";

// ---------- helpers ----------
const now = new Date().toISOString();
const uuid = () => crypto.randomUUID();

// ---------- Users ----------
export const mockUser: User = {
  id: uuid(),
  email: "test@mniiu.com",
  nickname: "AI Learner",
  avatarUrl: null,
  currentSkills: ["Java", "Spring Boot", "SQL"],
  learningGoal: "RAG",
  availableHours: 10,
  roles: ["USER"],
  status: "ACTIVE",
  createdAt: now,
};

export const mockTokenResponse = {
  userId: mockUser.id,
  accessToken: "mock-access-token-xxx",
  refreshToken: "mock-refresh-token-xxx",
  expiresIn: 900,
  tokenType: "Bearer" as const,
};

// ---------- Roadmap ----------
export const mockRoadmap: LearningRoadmap = {
  id: uuid(),
  version: 1,
  isActive: true,
  roadmap: {
    goal: "RAG",
    summary: "8 周掌握 RAG 工程实践，从 Embedding 基础到完整问答系统",
    weeks: [
      {
        week: 1,
        theme: "Embedding 与向量检索基础",
        objectives: ["理解 Embedding 原理", "掌握 pgvector 基本操作"],
        tasks: [
          { title: "搭建 pgvector 实验环境", description: "安装 PostgreSQL + pgvector 插件，跑通基础向量存储", estimatedHours: 3, deliverable: "可运行的向量存取 demo" },
          { title: "使用 Python 调用 Qwen Embedding API", description: "生成文档向量并存入数据库", estimatedHours: 4, deliverable: "脚本 + 100 条示例数据" },
        ],
      },
      {
        week: 2,
        theme: "检索增强生成 (RAG) 原理",
        objectives: ["理解 RAG 完整流程", "实现简单 RAG 链路"],
        tasks: [
          { title: "阅读 LangChain RAG 教程", description: "理解 Retriever + Generator 模式", estimatedHours: 3, deliverable: "学习笔记" },
          { title: "实现第一个 RAG 问答", description: "基于本地文档的简单问答", estimatedHours: 5, deliverable: "可对话的 CLI 应用" },
        ],
      },
    ],
  },
  createdAt: now,
};

export const mockProgress: RoadmapProgress = {
  roadmapId: mockRoadmap.id,
  completedTasks: 1,
  totalTasks: 4,
  completionRate: 0.25,
  items: [
    { weekNumber: 1, taskIndex: 0, status: "COMPLETED", completedAt: now },
    { weekNumber: 1, taskIndex: 1, status: "IN_PROGRESS", completedAt: null },
    { weekNumber: 2, taskIndex: 0, status: "NOT_STARTED", completedAt: null },
    { weekNumber: 2, taskIndex: 1, status: "NOT_STARTED", completedAt: null },
  ],
};

// ---------- Coach ----------
export const mockSessions: ChatSession[] = [
  { id: uuid(), title: "Spring AI RAG 入门问题", contextType: "GENERAL", contextId: null, createdAt: now, updatedAt: now },
  { id: uuid(), title: "pgvector 查询优化", contextType: "GENERAL", contextId: null, createdAt: now, updatedAt: now },
];

export const mockMessages: ChatMessage[] = [
  { id: uuid(), sessionId: mockSessions[0]?.id ?? "", role: "USER", content: "Spring AI 中如何接入 pgvector 做 RAG？", tokenCount: 20, streaming: false, failed: false, createdAt: now },
  {
    id: uuid(), sessionId: mockSessions[0]?.id ?? "", role: "ASSISTANT",
    content: "在 Spring AI 中接入 pgvector 做 RAG，推荐以下方案：\n\n1. **添加依赖**\n```java\n<dependency>\n  <groupId>org.springframework.ai</groupId>\n  <artifactId>spring-ai-pgvector-store</artifactId>\n</dependency>\n```\n\n2. **配置 Embedding 模型**\n```yaml\nspring.ai.openai.api-key: ${DASHSCOPE_API_KEY}\n```\n\n3. **创建 VectorStore**\n```java\n@Bean\npublic VectorStore vectorStore(JdbcTemplate jdbc, EmbeddingModel model) {\n  return new PgVectorStore(jdbc, model);\n}\n```\n\n这样就可以存储文档向量并进行语义检索了。",
    tokenCount: 512, streaming: false, failed: false, createdAt: now,
  },
];

// ---------- Projects ----------
export const mockProjects: Project[] = [
  {
    id: uuid(), type: "RAG", projectName: "企业知识库问答系统",
    description: "使用 Spring Boot + pgvector + Qwen 构建 RAG 应用",
    status: "ACTIVE",
    plan: { summary: "构建可上传文档并回答问题的 RAG 系统", milestones: [{ title: "M1: 数据导入", description: "支持 PDF/TXT 上传" }, { title: "M2: 问答系统", description: "基于检索的对话" }],
      architectureMermaid: "graph LR\n  A[用户上传] --> B[文档解析]\n  B --> C[Embedding]\n  C --> D[pgvector]\n  D --> E[检索]\n  E --> F[LLM 生成答案]",
      codeTemplates: [{ filename: "pom.xml", language: "xml", content: "<dependency>...</dependency>" }],
      risks: ["长文档分块策略"] },
    techStack: { backend: ["Spring Boot", "Spring AI"], database: ["PostgreSQL", "pgvector"] },
    tasks: [
      { id: uuid(), externalId: "T-001", title: "搭建基础工程", description: "创建 Spring Boot 项目，配置依赖", estimatedHours: 2, sortOrder: 0, completed: true, completedAt: now },
      { id: uuid(), externalId: "T-002", title: "实现文档上传", description: "支持 PDF/TXT 上传和解析", estimatedHours: 4, sortOrder: 1, completed: false, completedAt: null },
      { id: uuid(), externalId: "T-003", title: "实现向量存储", description: "Embedding + pgvector 存储", estimatedHours: 3, sortOrder: 2, completed: false, completedAt: null },
    ],
    completionRate: 0.33, createdAt: now, updatedAt: now,
  },
];

// ---------- Reviews ----------
export const mockReview: CodeReview = {
  id: uuid(), sourceType: "SNIPPET", sourceRef: null, language: "Java", fileCount: 1,
  review: {
    summary: "代码结构清晰，但缺少输入验证和异常处理",
    issues: [
      { severity: "HIGH", category: "security", file: "App.java", line: 12, message: "用户输入未做过滤，存在注入风险", suggestion: "使用参数化查询" },
      { severity: "MEDIUM", category: "maintainability", file: "App.java", line: 25, message: "方法过长，建议拆分", suggestion: "提取公共方法" },
      { severity: "LOW", category: "performance", file: "App.java", line: 8, message: "字符串拼接可优化", suggestion: "使用 StringBuilder" },
    ],
    strengths: ["命名规范", "包结构合理"],
    nextSteps: ["添加单元测试", "引入日志框架"],
  },
  score: { overall: 72, security: 60, maintainability: 75, performance: 80, testability: 65 },
  createdAt: now,
};

// ---------- Growth ----------
export const mockGrowth: GrowthProfile = {
  userId: mockUser.id, xp: 1250, level: 8, currentLevelXp: 1050, nextLevelXp: 1400,
  progressToNextLevel: 0.57, currentStreak: 5, longestStreak: 12,
  lastActivityDate: new Date().toISOString().split("T")[0] as string, totalProjects: 2, totalReviews: 4,
};

export const mockAchievements: Achievement[] = [
  { id: uuid(), name: "初学者徽章", description: "完成注册并开启 AI 原生学习之旅", icon: "seedling", xpReward: 20, unlocked: true, unlockedAt: now },
  { id: uuid(), name: "7天打卡王", description: "连续 7 天完成学习活动", icon: "flame", xpReward: 100, unlocked: false, unlockedAt: null },
  { id: uuid(), name: "代码大师", description: "完成第一个 AI 项目", icon: "code", xpReward: 150, unlocked: false, unlockedAt: null },
  { id: uuid(), name: "好学宝宝", description: "与 AI 教练累计完成 100 轮对话", icon: "message-circle", xpReward: 200, unlocked: false, unlockedAt: null },
];

export const mockNotifications: NotificationItem[] = [
  { id: uuid(), type: "ACHIEVEMENT", title: "恭喜获得「初学者徽章」", content: "你已完成注册并开始学习之旅！", isRead: false, createdAt: now },
  { id: uuid(), type: "STREAK", title: "连续打卡 5 天！", content: "保持每天学习的好习惯", isRead: true, createdAt: now },
];

export const mockStats: GrowthStats = {
  dailyXp: [
    { date: "2026-05-20", xp: 40 }, { date: "2026-05-21", xp: 80 },
    { date: "2026-05-22", xp: 30 }, { date: "2026-05-23", xp: 120 },
    { date: "2026-05-24", xp: 50 }, { date: "2026-05-25", xp: 90 },
    { date: "2026-05-26", xp: 60 },
  ],
  activityDistribution: [
    { type: "COACH_MESSAGE", count: 22 }, { type: "PROJECT_TASK_COMPLETED", count: 8 },
    { type: "REVIEW_SUBMITTED", count: 4 }, { type: "ROADMAP_TASK_COMPLETED", count: 6 },
  ],
  projectCompletion: { active: 1, completed: 1, archived: 0 },
};

// ---------- Landing ----------
export const mockLandingStats = { totalLearners: 2156, totalProjects: 583, totalCoachMessages: 12400 };

// ---------- Courses ----------
const courseId1 = uuid();
const courseId2 = uuid();

export const mockCourses: CourseSummary[] = [
  { id: courseId1, title: "RAG 工程实战", coverUrl: "", category: "AI_BASICS", difficulty: "INTERMEDIATE", totalLessons: 8, totalMinutes: 120, enrolled: true, progressPercent: 25 },
  { id: courseId2, title: "AI Agent 开发入门", coverUrl: "", category: "AI_BASICS", difficulty: "BEGINNER", totalLessons: 6, totalMinutes: 90, enrolled: false, progressPercent: 0 },
];

export const mockCourseDetail: CourseDetail = {
  id: courseId1,
  title: "RAG 工程实战",
  description: "从 Embedding 到完整问答系统的实战课程",
  coverUrl: null,
  category: "AI_BASICS",
  difficulty: "INTERMEDIATE",
  targetAudience: "ENGINEER",
  totalLessons: 8,
  totalMinutes: 120,
  enrolled: true,
  lessons: [
    { id: uuid(), title: "第一章：Embedding 基础", thumbnailUrl: null, durationSec: 600, sortOrder: 1, free: true, unlocked: true, completed: true },
    { id: uuid(), title: "第二章：向量检索", thumbnailUrl: null, durationSec: 900, sortOrder: 2, free: false, unlocked: true, completed: false },
    { id: uuid(), title: "第三章：RAG 架构", thumbnailUrl: null, durationSec: 1200, sortOrder: 3, free: false, unlocked: true, completed: false },
  ],
};

export const mockPlayUrl: PlayUrlResponse = {
  videoUrl: "https://example.com/sample-video.mp4",
  hlsManifestUrl: "https://example.com/sample-video/master.m3u8",
  durationSec: 600,
  lastPositionSec: 120,
  completed: false,
};

export const mockLessonProgress: ProgressSnapshot = {
  lastPositionSec: 120,
  validWatchedSec: 100,
  totalDurationSec: 600,
  watchRatio: 0.167,
  completed: false,
};

// ---------- Articles ----------
const articleId1 = uuid();
const articleId2 = uuid();
const articleId3 = uuid();

const sampleMarkdown = `# 深入理解 React Hooks

React Hooks 是 React 16.8 引入的新特性，它让你在函数组件中使用状态和其他 React 特性。

## 什么是 Hooks

Hooks 是一些可以让你在函数组件里"钩入" React state 及生命周期等特性的函数。

### 为什么需要 Hooks

- **组件间复用状态逻辑困难**
- **复杂组件变得难以理解**
- **Class 的 this 绑定问题**

## 常用 Hooks

### useState

\`useState\` 是最基础的 Hook，用于在函数组件中添加状态。

\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

### useEffect

\`useEffect\` 用于处理副作用，相当于 componentDidMount、componentDidUpdate 和 componentWillUnmount 的组合。

## 总结

Hooks 让函数组件拥有了类组件的能力，同时更加简洁和灵活。`;

export const mockArticles: ArticleSummary[] = [
  {
    id: articleId1, title: "深入理解 React Hooks", slug: "react-hooks-deep-dive",
    summary: "全面介绍 React Hooks 的使用方法和最佳实践", content: sampleMarkdown,
    coverUrl: null, category: "前端", tags: ["React", "Hooks", "前端"],
    authorId: mockUser.id, status: "PUBLISHED", targetAudience: "ALL", difficulty: "INTERMEDIATE",
    readMinutes: 8, viewCount: 1234, likeCount: 89, associatedType: null, associatedId: null,
    publishedAt: now, createdAt: now,
  },
  {
    id: articleId2, title: "Spring Boot 整合 pgvector 实战", slug: "spring-boot-pgvector",
    summary: "手把手教你用 Spring Boot + pgvector 构建向量检索应用", content: sampleMarkdown,
    coverUrl: null, category: "后端", tags: ["Spring Boot", "pgvector", "RAG"],
    authorId: mockUser.id, status: "PUBLISHED", targetAudience: "ENGINEER", difficulty: "INTERMEDIATE",
    readMinutes: 12, viewCount: 856, likeCount: 67, associatedType: null, associatedId: null,
    publishedAt: now, createdAt: now,
  },
  {
    id: articleId3, title: "AI Agent 开发入门指南", slug: "ai-agent-guide",
    summary: "从零开始构建你的第一个 AI Agent", content: sampleMarkdown,
    coverUrl: null, category: "AI", tags: ["AI", "Agent", "LLM"],
    authorId: mockUser.id, status: "DRAFT", targetAudience: "ALL", difficulty: "BEGINNER",
    readMinutes: 15, viewCount: 0, likeCount: 0, associatedType: null, associatedId: null,
    publishedAt: null, createdAt: now,
  },
];

export const mockArticleDetail: ArticleDetail = {
  id: articleId1, title: "深入理解 React Hooks", slug: "react-hooks-deep-dive",
  summary: "全面介绍 React Hooks 的使用方法和最佳实践", content: sampleMarkdown,
  coverUrl: null, category: "前端", tags: ["React", "Hooks", "前端"],
  authorName: "AI Learner", targetAudience: "ALL", difficulty: "INTERMEDIATE",
  readMinutes: 8, viewCount: 1234, likeCount: 89, publishedAt: now, createdAt: now,
};

// ---------- Interview ----------
const questionId1 = uuid();
const questionId2 = uuid();
const questionId3 = uuid();
const setId1 = uuid();
const mockInterviewId1 = uuid();

export const mockQuestions: InterviewQuestion[] = [
  {
    id: questionId1, category: "JAVA", subCategory: "COLLECTION", difficulty: "EASY",
    title: "ArrayList 与 LinkedList 的区别",
    content: "请详细说明 ArrayList 和 LinkedList 在底层数据结构、随机访问性能、插入删除性能方面的区别。",
    keyPoints: ["底层数据结构", "时间复杂度", "适用场景"],
    companies: ["阿里巴巴", "字节跳动"],
    tags: ["集合", "数据结构"],
    source: "真题", status: "ACTIVE", viewCount: 256, createdAt: now,
  },
  {
    id: questionId2, category: "JAVA", subCategory: "CONCURRENCY", difficulty: "MEDIUM",
    title: "synchronized 与 ReentrantLock 的区别",
    content: "请对比 synchronized 关键字和 ReentrantLock 在锁机制、可中断性、公平性方面的异同。",
    keyPoints: ["锁升级", "可中断锁", "公平锁"],
    companies: ["腾讯", "美团"],
    tags: ["并发", "锁"],
    source: "真题", status: "ACTIVE", viewCount: 189, createdAt: now,
  },
  {
    id: questionId3, category: "ALGORITHM", subCategory: "DYNAMIC_PROGRAMMING", difficulty: "MEDIUM",
    title: "最长递增子序列 (LIS)",
    content: "给定一个整数数组，找到其中最长严格递增子序列的长度。要求 O(n log n)。",
    keyPoints: ["DP 思路", "二分优化", "边界处理"],
    companies: ["字节跳动"],
    tags: ["DP", "二分"],
    source: "真题", status: "ACTIVE", viewCount: 342, createdAt: now,
  },
];

export const mockSets: InterviewSet[] = [
  {
    id: setId1, title: "Java 后端一面模拟", description: "覆盖 Java 基础、并发、集合等核心知识点",
    targetRole: "Java后端工程师", difficulty: "MEDIUM",
    questionIds: [questionId1, questionId2], durationMinutes: 45, status: "ACTIVE", createdAt: now,
  },
];

export const mockInterview: MockInterview = {
  id: mockInterviewId1, userId: mockUser.id, interviewSetId: setId1,
  mode: "SET", status: "COMPLETED", overallScore: 75,
  aiSummary: "整体表现良好，基础知识扎实，部分知识点需要加强。",
  startedAt: now, completedAt: now, durationSeconds: 1800,
};

export const mockSkillProfile: InterviewSkillProfile[] = [
  { id: uuid(), userId: mockUser.id, category: "JAVA", avgScore: 7.5, interviewCount: 3, lastUpdated: now },
  { id: uuid(), userId: mockUser.id, category: "ALGORITHM", avgScore: 6.0, interviewCount: 2, lastUpdated: now },
  { id: uuid(), userId: mockUser.id, category: "SYSTEM_DESIGN", avgScore: 5.5, interviewCount: 1, lastUpdated: now },
];

// ---------- Quiz ----------
const examId1 = uuid();
const examId2 = uuid();
const examQuestionId1 = uuid();
const examQuestionId2 = uuid();
const examQuestionId3 = uuid();
const examQuestionId4 = uuid();
const examQuestionId5 = uuid();
const recordId1 = uuid();

export const mockExams: Exam[] = [
  {
    id: examId1, roadmapId: "1", week: 1, title: "第1周：Embedding 与向量检索基础",
    description: "本测验检验你对 Embedding 与向量检索基础的掌握程度",
    questionCount: 5, timeLimitMinutes: 30, passingScore: 60, createdAt: now,
  },
  {
    id: examId2, roadmapId: "1", week: 2, title: "第2周：检索增强生成 (RAG) 原理",
    description: "本测验检验你对 RAG 原理的掌握程度",
    questionCount: 5, timeLimitMinutes: 30, passingScore: 60, createdAt: now,
  },
];

export const mockExamQuestions: ExamQuestion[] = [
  {
    id: examQuestionId1, examId: examId1, questionType: "SINGLE_CHOICE", orderNum: 1,
    content: "以下哪项是 Embedding 的主要作用？",
    options: [
      { key: "A", content: "将文本转换为数值向量" },
      { key: "B", content: "压缩文本大小" },
      { key: "C", content: "加密文本内容" },
      { key: "D", content: "美化文本显示" },
    ],
    explanation: "Embedding 将高维文本映射到低维稠密向量空间，便于语义计算。",
    xpReward: 5,
  },
  {
    id: examQuestionId2, examId: examId1, questionType: "SINGLE_CHOICE", orderNum: 2,
    content: "pgvector 是哪个数据库的扩展？",
    options: [
      { key: "A", content: "MySQL" },
      { key: "B", content: "PostgreSQL" },
      { key: "C", content: "MongoDB" },
      { key: "D", content: "Redis" },
    ],
    explanation: "pgvector 是 PostgreSQL 的向量搜索扩展。",
    xpReward: 5,
  },
  {
    id: examQuestionId3, examId: examId1, questionType: "MULTI_CHOICE", orderNum: 3,
    content: "以下哪些是向量相似度计算方法？（多选）",
    options: [
      { key: "A", content: "余弦相似度" },
      { key: "B", content: "欧氏距离" },
      { key: "C", content: "曼哈顿距离" },
      { key: "D", content: "哈希冲突" },
    ],
    explanation: "余弦相似度、欧氏距离、曼哈顿距离都是常用的向量相似度计算方法。",
    xpReward: 10,
  },
  {
    id: examQuestionId4, examId: examId1, questionType: "SINGLE_CHOICE", orderNum: 4,
    content: "在 RAG 系统中，Retriever 的主要职责是什么？",
    options: [
      { key: "A", content: "生成最终答案" },
      { key: "B", content: "从知识库检索相关文档" },
      { key: "C", content: "处理用户输入" },
      { key: "D", content: "渲染页面" },
    ],
    explanation: "Retriever 负责根据用户查询从知识库中检索相关文档片段。",
    xpReward: 5,
  },
  {
    id: examQuestionId5, examId: examId1, questionType: "THINKING", orderNum: 5,
    content: "请描述你在实际项目中如何设计一个 RAG 系统，包括文档分块、Embedding 选择、检索策略等。",
    options: null,
    explanation: "评分维度：概念准确性、方案完整性、代码示例质量、最佳实践遵循、创新性深度",
    xpReward: 10,
  },
];

export const mockExamRecord: ExamRecord = {
  id: recordId1, userId: mockUser.id, examId: examId1,
  score: 75, passed: true, totalQuestions: 5, correctCount: 3,
  answers: [
    { questionId: examQuestionId1, questionType: "SINGLE_CHOICE", userAnswer: "A", isCorrect: true, pointsEarned: 5 },
    { questionId: examQuestionId2, questionType: "SINGLE_CHOICE", userAnswer: "B", isCorrect: true, pointsEarned: 5 },
    { questionId: examQuestionId3, questionType: "MULTI_CHOICE", userAnswer: ["A", "B"], isCorrect: false, pointsEarned: 0 },
    { questionId: examQuestionId4, questionType: "SINGLE_CHOICE", userAnswer: "B", isCorrect: true, pointsEarned: 5 },
    { questionId: examQuestionId5, questionType: "THINKING", userAnswer: "我会使用滑动窗口分块...", isCorrect: null, pointsEarned: 7 },
  ],
  aiEvaluation: {
    thinkingQuestions: [
      {
        questionId: examQuestionId5, score: 7, maxScore: 10,
        feedback: "回答较完整，涵盖了分块和检索策略，但缺少具体的代码示例。",
        dimensionScores: { "概念准确性": 2, "方案完整性": 2, "代码示例质量": 1, "最佳实践遵循": 1, "创新性深度": 1 },
      },
    ],
    overallComment: "整体表现良好，基础知识扎实，多选题需要加强。",
  },
  startedAt: now, completedAt: now,
};

export const mockMastery: MasterySummary = {
  overallScore: 75, overallLevel: "GOOD", testedWeeks: 1, totalWeeks: 2,
  weekMastery: [
    { week: 1, score: 75, level: "GOOD", attempts: 1, bestScore: 75, lastExamAt: now },
    { week: 2, score: null, level: "NOT_TESTED", attempts: 0, bestScore: null, lastExamAt: null },
  ],
};
