export const APP_NAME = "MNIU AI Camp";

export const SKILL_PRESETS = [
  "Java", "Spring Boot", "Python", "SQL", "Docker", "React",
  "TypeScript", "Go", "LLM", "机器学习基础", "REST API", "Git",
] as const;

export const REVIEW_LANGUAGES = [
  "Java", "Python", "TypeScript", "JavaScript", "Go", "SQL", "Markdown",
] as const;

export const PROJECT_TYPE_META: Record<string, { label: string; description: string; icon: string }> = {
  RAG: { label: "RAG 应用", description: "构建知识库问答、向量检索、检索增强生成", icon: "DatabaseZap" },
  AGENT: { label: "Agent 应用", description: "构建工具调用、计划执行、多步骤推理智能体", icon: "Bot" },
  AI_SaaS: { label: "AI SaaS", description: "构建可商业化 AI SaaS 应用", icon: "PanelsTopLeft" },
  MCP_SERVER: { label: "MCP Server", description: "构建 Model Context Protocol 服务", icon: "PlugZap" },
};

export const NAV_ITEMS = [
  { label: "工作台", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "路线图", href: "/roadmap", icon: "Map" },
  { label: "AI 教练", href: "/coach", icon: "MessagesSquare" },
  { label: "项目", href: "/projects", icon: "FolderKanban" },
  { label: "代码审查", href: "/review", icon: "Code2" },
] as const;
