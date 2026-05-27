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
