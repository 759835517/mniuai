---

# MNIU AI Camp - Product Requirements Document (AI-Executable)

| 字段 | 内容 |
|------|------|
| 产品名称 | MNIU AI Camp |
| 版本 | MVP v1.0 |
| 状态 | Draft → Ready for AI Development |
| 目标执行者 | AI Coding Agent (e.g., Devin, Cursor, Copilot Workspace) |

---

## 1. 产品愿景与价值主张

**一句话描述**：为转型 AI 开发的工程师提供 AI 原生的学习、练习和成长平台。

**核心价值**：
- 个性化 AI 学习路径生成，替代静态教程。
- AI 作为即时编程导师、项目教练和代码审查员，模拟真实结对编程体验。
- 游戏化成长体系，量化学习成果，保持长期动力。

**成功指标**：
- 用户完成一个学习计划的留存率 > 60%。
- AI 代码审查被采纳率 > 40%。
- 平均每周项目实操次数 ≥ 2 次。

---

## 2. 目标用户画像

| 角色 | 描述 | 核心需求 |
|------|------|----------|
| Java 转型开发者 | 3年+ Java 后端经验，想进入 AI 工程领域 | 需要结构化路径，避免从零学 Python 的弯路 |
| Agent/RAG 学习者 | 已了解基础 LLM，想深入开发智能体、RAG 应用 | 需要项目实战指导、架构建议和代码审查 |
| AI 初学者 | 编程基础弱，但对 AI 感兴趣 | 需要概念讲解、调试帮助和循序渐进的学习建议 |
| 转型工程师通用 | 任何想从传统软件转向 AI 工程的开发者 | 需要技能差距分析、成长追踪和社区感 |

---

## 3. 用户核心旅程

1. **注册/登录** → 输入现有技能、学习目标、每周可用时间。
2. **AI 生成学习路线图** → 包含周目标、推荐项目。
3. **进行学习**：
    - 在 AI 编程教练中提问、贴代码。
    - 开启项目教练，选择项目类型，获得拆解和模板。
    - 提交 GitHub 仓库或代码片段进行审查。
4. **持续成长**：每日打卡、获得经验值（XP）、升级、完成项目后获得特殊成就。
5. **迭代目标**：可随时更新技能与时间，生成新路线图。

---

## 4. 功能详细规格（MVP）

### 4.1 AI 学习路线图生成 (AI Learning Roadmap)

**用户故事**：
> 作为一名转型开发者，我希望输入当前的技能、目标和可用时间，就能获得一份个性化的学习路线图和每周目标，以便我清晰知道每天该学什么。

**验收标准**：

- **Given** 用户已登录并位于路线图生成页面  
  **When** 用户填写表单：
    - 当前技能（多选：Java, Spring, Python, 机器学习基础等，或自由文本）
    - 学习目标（单选：Agent 开发, RAG 开发, AI SaaS 全栈, MCP Server 开发）
    - 每周可用学习小时数（下拉：<5h, 5-10h, 10-20h, >20h）  
      **Then** 系统调用 AI 服务，返回结构化路线图（JSON 格式），前端渲染为时间轴视图。

- **Given** 路线图已生成  
  **When** 用户查看路线图  
  **Then** 可以看到：总周数、每周主题、每周目标列表、推荐项目列表，并可以点击展开具体任务。

**AI 交互规格**：

- **输入 Prompt 模板**（系统消息）：
  ```
  你是一个 AI 学习路径规划专家。请根据用户的技能、目标和时间，生成一个学习路线图。  
  输出必须为合法的 JSON，格式如下：
  {
    "total_weeks": <number>,
    "weeks": [
      {
        "week": <number>,
        "theme": "<string>",
        "goals": ["<string>"],
        "recommended_projects": ["<project_id or title>"],
        "estimated_hours": <number>
      }
    ]
  }
  路线要求：循序渐进、包含实操项目、利用用户已有技能（如 Java）平滑过渡到 AI。
  ```

- **输出示例**：
  ```json
  {
    "total_weeks": 8,
    "weeks": [
      {
        "week": 1,
        "theme": "Python for Java Devs & LLM 基础",
        "goals": ["掌握 Python 基本语法及差异", "理解 LLM 原理及 API 调用"],
        "recommended_projects": ["构建一个简单的 Qwen 聊天终端"],
        "estimated_hours": 10
      },
      ...
    ]
  }
  ```

- **数据持久化**：路线图存入 `learning_roadmaps` 表，关联用户 ID，支持重新生成和版本记录。

**UI 组件**：
- 路线图生成表单（技能多选+自由文本，目标下拉，时间选择）
- 路线图展示：横向时间轴/纵向列表，可展开周详情
- “重新生成”按钮（需确认，避免意外覆盖）

---

### 4.2 AI 编程教练 (AI Coding Coach)

**用户故事**：
> 作为一名学习者，我希望可以随时向 AI 教练提问，获得代码解答、概念解释、调试帮助和学习建议，就像有一位资深导师陪伴。

**验收标准**：

- **Given** 用户在学习界面点击“AI Coach”  
  **When** 进入聊天窗口  
  **Then** 可以看到上下文介绍、快捷提问模板，并支持自由文本输入和代码片段粘贴。

- **Given** 用户提问了一个 Java 调用大模型的问题  
  **When** AI 回答时  
  **Then** 回答应包含：解释、代码示例（若涉及）、最佳实践、相关学习资源链接（可选）。

- **Given** 用户粘贴了一段报错代码和日志  
  **When** 请求调试  
  **Then** AI 应分析错误原因，给出修复后的代码，并解释为什么出错。

- **Given** 历史对话已存在  
  **When** 用户返回聊天界面  
  **Then** 可以看到之前的对话记录，支持继续对话（由后端保存会话上下文）。

**AI 交互规格**：

- **系统提示词**：
  ```
  你是 MNIU AI Camp 的编程教练，专门帮助 Java 背景的开发者转向 AI 工程。  
  你的回答必须：
  - 准确、深入，并尽量关联 Java 生态（如 Spring AI、LangChain4j 等）
  - 包含代码示例时注明语言
  - 如果问题模糊，可追问澄清
  - 始终鼓励最佳工程实践
  ```

- **上下文管理**：后端需存储会话消息（`chat_messages` 表），每次请求将最近 N 条历史记录发送给 AI 模型以保持上下文。

**UI 组件**：
- 聊天界面（类似 ChatGPT），支持 Markdown 渲染、代码高亮。
- 侧边栏：历史会话列表，可新建会话、删除会话。

---

### 4.3 AI 项目教练 (AI Project Coach)

**用户故事**：
> 作为一名学习者，我想选择一个项目类型（RAG/Agent/SaaS/MCP Server），获得项目拆解、任务分解、代码模板和架构建议，以便我能快速启动并完成一个真实项目。

**验收标准**：

- **Given** 用户进入项目教练模块  
  **When** 选择一个项目类型（枚举值）  
  **Then** AI 生成结构化项目计划，包含：
    - 项目概述
    - 架构图描述（可用 Mermaid 文本）
    - 功能拆解为任务列表（支持任务状态跟踪）
    - 推荐技术栈和代码模板（GitHub 链接或内联代码骨架）
    - 学习要点

- **Given** 项目计划已生成  
  **When** 用户在任务列表中勾选完成某个任务  
  **Then** 系统记录进度，并触发 AI 提供下一步提示或相关知识。

- **Given** 用户请求代码模板  
  **When** AI 返回代码  
  **Then** 应基于用户已填写的偏好语言（如 Java）生成基础代码，并包含 README 骨架。

**AI 交互规格**：

- **项目类型枚举**：`RAG`, `Agent`, `AI_SaaS`, `MCP_SERVER`
- **输出 JSON Schema** (AI 必须遵守)：
  ```json
  {
    "project_name": "string",
    "overview": "string",
    "architecture_mermaid": "string",
    "tasks": [
      {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "estimated_hours": "number",
        "order": "number",
        "learning_points": ["string"]
      }
    ],
    "recommended_stack": {
      "backend": "string",
      "frontend": "string",
      "ai": "string",
      "database": "string"
    },
    "code_templates": [
      {
        "filename": "string",
        "language": "string",
        "content": "string"
      }
    ]
  }
  ```
- **后端存储**：项目计划存到 `projects` 表，任务存到 `project_tasks` 表，支持更新完成状态。

**UI 组件**：
- 项目类型选择卡片（带简要说明）
- 项目仪表盘：架构图（Mermaid 渲染）、任务看板（拖拽或勾选）、代码模板预览区域
- “与教练讨论此项目”快捷按钮，跳转到 AI 教练并带入项目上下文。

---

### 4.4 AI 代码审查 (AI Code Review)

**用户故事**：
> 作为一名开发者，我希望提交我的 GitHub 仓库或代码片段，获得 AI 的代码审查意见和改进建议，以提高代码质量和工程实践。

**验收标准**：

- **Given** 用户进入代码审查页面  
  **When** 输入公共 GitHub 仓库 URL 或直接粘贴代码片段（支持多文件）  
  **Then** 系统分析代码，返回审查结果，包含：
    - 总体评价
    - 优点
    - 问题列表（按严重程度：错误/警告/建议）
    - 改进建议和重构示例
    - 学习资源推荐

- **Given** 审查已完成  
  **When** 用户查看结果  
  **Then** 所有代码示例显示行内高亮差异（如适用）。

- **Given** GitHub 仓库过大  
  **When** AI 无法处理所有文件  
  **Then** 提示用户指定重点文件或目录，或仅分析摘要。

**AI 交互规格**：

- **系统提示词**：
  ```
  你是一位资深 AI 工程代码审查员。请审查提供的代码，重点关注：
  - AI 应用特有的最佳实践（如 Prompt 管理、RAG 数据预处理）
  - 代码结构、可维护性、安全性
  - 针对 Java/Spring AI 生态给出具体建议
  返回格式使用 Markdown，清晰分类。
  ```

- **输入**：可直接包含代码文本；对于仓库，后端先通过 GitHub API 获取文件内容和目录结构，选择性发给 AI。
- **审查结果存储**：保存到 `code_reviews` 表，支持历史记录查看。

**UI 组件**：
- 输入区：GitHub URL 输入框，或代码编辑器（支持多标签页）。
- 审查结果展示：分类折叠面板，问题项支持定位到对应代码行（Monaco Editor diff 视图）。

---

### 4.5 成长体系 (Growth System)

**用户故事**：
> 作为一个学习者，我希望平台记录我的每日学习、项目完成和技能进步，通过等级、打卡和经验值给予我激励和成就感。

**验收标准**：

- **Given** 用户完成了任意学习活动（观看路线图任务、和教练对话满一定次数、完成项目任务、收到审查结果）  
  **When** 活动被记录  
  **Then** 系统增加 XP，更新每日打卡状态，连续打卡天数计数。

- **Given** 用户 XP 达到下一等级阈值  
  **When** 升级时  
  **Then** 前端展示升级动画，解锁新成就徽章（可选）。

- **Given** 用户查看个人主页  
  **When** 加载时  
  **Then** 显示当前等级、XP 进度条、连续打卡天数、已完成项目数、获得的成就列表。

**数据模型**：
- 用户扩展信息表：`user_growth` (user_id, xp, level, current_streak, longest_streak, last_activity_date)
- 活动日志：`activity_log` (id, user_id, activity_type, xp_earned, timestamp)
- 成就定义：`achievements` (id, name, description, icon, criteria_json)
- 用户成就关联：`user_achievements` (user_id, achievement_id, unlocked_at)

**经验值规则（可配置）**：
- 完成每日路线图任务 +20 XP
- 与 AI 教练对话（满 5 轮） +10 XP
- 完成项目任务 +50 XP
- 项目审查提交 +30 XP
- 连续打卡额外奖励：7天 +50 XP, 30天 +200 XP

**UI 组件**：
- 顶部导航栏显示等级和打卡火焰图标
- 个人中心仪表盘（XP 进度条、统计图表）
- 成就墙

---

## 5. 数据模型与数据库概要

使用 PostgreSQL，启用 `pgvector` 扩展以备将来存储向量。

### 核心表

**users**  
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID PK | |
| email | varchar unique | |
| password_hash | varchar | |
| current_skills | jsonb | ["Java", "Spring"] |
| learning_goal | varchar | Agent / RAG / ... |
| available_hours | int | 每周小时数 |
| created_at | timestamp | |

**learning_roadmaps**  
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID PK | |
| user_id | FK → users | |
| generation_input | jsonb | {skills, goal, hours} |
| roadmap_json | jsonb | 生成的路线图结构 |
| version | int | 重新生成时递增 |
| is_active | boolean | |
| created_at | timestamp | |

**chat_sessions** / **chat_messages**
- session: id, user_id, title, created_at
- message: id, session_id, role (user/assistant), content, created_at

**projects** / **project_tasks**
- project: id, user_id, type, plan_json (完整AI输出), status
- task: id, project_id, title, completed, completed_at, order

**code_reviews**
- id, user_id, source_type (repo/snippet), source_ref, review_json, created_at

**user_growth** (如前所述)  
**activity_log**  
**achievements** / **user_achievements**

---

## 6. API 设计概览（RESTful）

基础路径 `/api/v1`

### 路线图
- `POST /roadmap/generate`  → 生成路线图  
  Body: `{ "skills": [...], "goal": "...", "hours": 8 }`  
  Response: roadmap JSON
- `GET /roadmap/active` → 获取当前激活路线图
- `PUT /roadmap/regenerate` → 重新生成（保留历史）

### 教练
- `POST /coach/sessions` → 创建新会话
- `GET /coach/sessions` → 列表
- `POST /coach/sessions/{id}/messages` → 发送消息，返回 AI 流式响应 (SSE)
- `GET /coach/sessions/{id}/messages` → 获取历史

### 项目
- `POST /projects` → 创建新项目（选择类型，生成计划）
- `GET /projects` → 用户项目列表
- `GET /projects/{id}` → 项目详情含任务
- `PATCH /projects/{id}/tasks/{taskId}` → 更新任务状态
- `POST /projects/{id}/discuss` → 将项目上下文带入教练（创建专用会话）

### 代码审查
- `POST /review` → 提交审查  
  Body: `{ "repo_url": "..." }` 或 `{ "snippet": "...", "language": "java" }`  
  Response: 审查结果 JSON
- `GET /review/history` → 历史记录

### 成长
- `GET /growth/profile` → 用户成长数据
- `GET /growth/achievements` → 成就列表
- `POST /growth/activity` (内部调用) → 记录活动并增加XP

### 认证
- `POST /auth/register`
- `POST /auth/login`
- JWT 保护其他端点。

---

## 7. AI 服务集成说明

- 使用 **Spring AI Alibaba** 作为统一 AI 客户端。
- 模型：默认使用 **Qwen** (通义千问) 系列，同时兼容 OpenAI API。
- 对话记忆由数据库管理，每次请求时携带最近 10 轮消息作为上下文。
- 所有 AI 生成必须遵循预定义的 JSON Schema（通过 `@Tool` 或结构化输出功能强制约束）。
- 非结构化输出（如教练回答、代码审查）使用 Markdown 返回。
- 当需要生成路线图、项目计划等结构化数据时，必须验证 JSON，若解析失败则触发重试机制（最多 2 次）。

---

## 8. 非功能性需求

- **性能**：AI 生成响应时间 < 15s（流式首字 < 3s），普通 API 响应 < 200ms。
- **安全**：JWT 认证，防止 Prompt 注入（需过滤用户输入中的“忽略指令”模式），GitHub URL 仅允许公共仓库，代码片段大小限制 500KB。
- **可扩展性**：后端无状态，会话通过数据库共享，支持横向扩展。
- **可用性**：MVP 阶段 99.5% uptime。

---

## 9. 设计准则与前端组件风格

- **设计风格**：现代 AI SaaS 暗色模式，极简，开发者导向，参考 Cursor / Windsurf。
- **设计 Token**：
    - 背景色：`#0D1117`（类 GitHub Dark）
    - 主强调色：亮蓝渐变 `#3B82F6` → `#8B5CF6`
    - 代码区：等宽字体 JetBrains Mono，行号，深色背景。
- **关键页面**：
    - `/dashboard` – 路线图概览 + 成长摘要
    - `/roadmap` – 路线图生成与展示
    - `/coach` – 聊天界面（带侧边栏）
    - `/projects` – 项目列表与看板
    - `/review` – 代码审查提交与结果
    - `/profile` – 成长数据、成就
- **组件库**：基于 TailwindCSS + Headless UI，所有交互需支持键盘导航和屏幕阅读器（WCAG AA）。

---

## 10. 未来功能（V2+）

- 多智能体系统（Multi-Agent）协作教学
- AI 面试官模拟
- AI 结对编程（直接在 IDE 插件内）
- AI 课堂（直播授课辅助）
- AI 生成编码挑战赛

---

## 11. 开发指导与执行顺序（供 AI Agent 参考）

1. 初始化工程（Next.js + Spring Boot 项目骨架）
2. 实现用户认证与基础框架
3. 构建用户技能与成长数据模型，实现成长系统记录逻辑
4. 集成 Spring AI Alibaba，实现 AI 教练对话（无上下文记忆 → 添加记忆）
5. 实现路线图生成（表单 → AI 调用 → JSON 解析 → 渲染）
6. 实现项目教练与任务管理
7. 实现代码审查（GitHub API 集成或文本输入）
8. 完善 UI/UX、仪表盘、成就系统
9. 测试与部署（Vercel + Railway）

---


