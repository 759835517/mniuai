---

# MNIU AI Camp - 测验与考试模块 PRD

| 字段 | 内容 |
|------|------|
| 模块名称 | Quiz & Exam（测验与考试） |
| 版本 | v1.0 |
| 关联模块 | AI 学习路线图（4.1）、成长体系（4.5） |
| 优先级 | P0（核心学习闭环） |

---

## 1. 模块背景与目标

### 1.1 问题

当前学习路线图中，用户完成路线图任务（勾选完成）仅依赖自评，缺乏客观的知识掌握度评估手段。用户可能"觉得学会了"但实际并未真正理解，导致学习质量无法量化。

### 1.2 目标

引入**测验与考试模块**，为学习路线图中的每个知识主题提供验证性测验：

- **以选择题为主**，降低作答门槛，利于反复记忆巩固。
- **以思考题为辅**，提交后由 AI 评分，考察深度理解能力。
- **自动计算得分**，形成考试记录，可回溯历史。
- **同步掌握程度到学习路线图**，让路线图进度不仅反映"完成度"，还反映"掌握度"。

### 1.3 成功指标

| 指标 | 目标值 |
|------|--------|
| 用户完成路线图任务后参与测验的转化率 | ≥ 50% |
| 选择题平均正确率 | 60%~80%（说明题目有区分度） |
| 考试记录查看率（用户回看历史） | ≥ 30% |
| 路线图页面展示掌握程度后用户满意度 | ≥ 4.0/5.0 |

---

## 2. 用户故事

### US-1：参与测验

> 作为一个学习者，我希望在完成路线图中某个周/主题的学习后，能够参加一个对应的测验，通过回答选择题和思考题来检验自己是否真正掌握。

### US-2：查看考试结果

> 作为一个学习者，我希望提交测验后立即看到得分、每道题的对错情况和解析，以便知道哪些知识点还需要加强。

### US-3：查看考试记录

> 作为一个学习者，我希望查看自己的所有考试历史记录，包括每次考试的时间、得分、题目数量和通过状态。

### US-4：查看路线图掌握程度

> 作为一个学习者，我希望在路线图的每个周/主题上看到我的掌握程度（如：优秀/良好/及格/未测），这样我能一目了然地知道哪些主题还需要加强。

---

## 3. 功能详细规格

### 3.1 测验/考试定义

#### 3.1.1 数据结构

每场测验（Exam）与路线图的某个**周（Week）** 关联：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | Snowflake ID |
| roadmap_id | bigint FK | 关联路线图 |
| week | int | 对应路线图的第几周 |
| title | varchar(200) | 测验标题，如"第1周：Python基础与LLM入门" |
| description | text | 测验说明 |
| question_count | int | 题目总数 |
| time_limit_minutes | int | 时间限制（分钟），0=不限时 |
| passing_score | int | 通过分数线（百分制） |
| created_at | timestamp | 创建时间 |

#### 3.1.2 题目结构

每场测验包含多道题目：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | Snowflake ID |
| exam_id | bigint FK | 关联测验 |
| question_type | varchar(20) | `SINGLE_CHOICE` / `MULTI_CHOICE` / `THINKING` |
| order_num | int | 题目序号（从1开始） |
| content | text | 题目内容（支持 Markdown） |
| options | jsonb | 选择题选项数组，思考题为 null |
| correct_answer | jsonb | 选择题正确答案（单选为字符串，多选为字符串数组），思考题为 null |
| explanation | text | 答案解析（选择题的解析，思考题为评分标准要点） |
| xp_reward | int | 答对获得的 XP |
| created_at | timestamp | 创建时间 |

**options JSON 格式**：
```json
[
  { "key": "A", "content": "Python 是一种编译型语言" },
  { "key": "B", "content": "Python 是一种解释型语言" },
  { "key": "C", "content": "Python 无法进行面向对象编程" },
  { "key": "D", "content": "Python 没有类型系统" }
]
```

**correct_answer JSON 格式**：
- 单选题：`"B"`
- 多选题：`["A", "B"]`
- 思考题：`null`（由 AI 评分）

#### 3.1.3 考试记录

每次用户参加测验生成一条记录：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | Snowflake ID |
| user_id | bigint FK | 关联用户 |
| exam_id | bigint FK | 关联测验 |
| score | int | 最终得分（0-100） |
| passed | boolean | 是否通过（score >= passing_score） |
| total_questions | int | 总题数 |
| correct_count | int | 选择题答对数 |
| answers | jsonb | 用户提交的完整答案 |
| ai_evaluation | jsonb | AI 对思考题的评分详情 |
| started_at | timestamp | 开始时间 |
| completed_at | timestamp | 提交时间 |
| created_at | timestamp | 创建时间 |

**answers JSON 格式**：
```json
[
  {
    "question_id": 123,
    "question_type": "SINGLE_CHOICE",
    "user_answer": "B",
    "is_correct": true,
    "points_earned": 10
  },
  {
    "question_id": 124,
    "question_type": "MULTI_CHOICE",
    "user_answer": ["A", "B"],
    "is_correct": false,
    "points_earned": 0
  },
  {
    "question_id": 125,
    "question_type": "THINKING",
    "user_answer": "我认为...",
    "ai_score": 8,
    "ai_feedback": "回答较好，但缺少...",
    "points_earned": 8
  }
]
```

**ai_evaluation JSON 格式**：
```json
{
  "thinking_questions": [
    {
      "question_id": 125,
      "score": 8,
      "max_score": 10,
      "feedback": "回答较好，但缺少对 Spring AI 整合方式的描述...",
      "strengths": ["概念理解清晰", "举例恰当"],
      "improvements": ["建议补充 Spring AI 的具体代码示例", "可增加对异常处理的说明"]
    }
  ],
  "overall_comment": "整体表现良好，建议重点复习 Spring AI 集成部分。"
}
```

#### 3.1.4 掌握程度

每个路线图周的掌握程度根据考试结果自动计算：

| 掌握程度 | 分数范围 | 颜色标识 |
|----------|----------|----------|
| `MASTERY`（精通） | 90-100 | 🟢 绿色 |
| `GOOD`（良好） | 75-89 | 🔵 蓝色 |
| `PASS`（及格） | 60-74 | 🟡 黄色 |
| `FAIL`（不及格） | 0-59 | 🔴 红色 |
| `NOT_TESTED`（未测试） | — | ⚪ 灰色 |

路线图整体掌握程度 = 所有已测试周的加权平均（按题目数量加权）。

---

### 3.2 测验生成（AI 辅助）

#### 3.2.1 自动生成

当路线图生成后，系统自动为每一周生成对应的测验和题目：

- **触发时机**：路线图生成完成 → 自动调用 AI 生成测验
- **AI Prompt 模板**：

```
你是一位 AI 教育专家，擅长设计技术测验题目。
请根据以下学习路线图中第 {week} 周的内容，生成一场测验。

周主题：{theme}
学习目标：{goals}
推荐项目：{recommended_projects}

要求：
1. 生成 10 道选择题（8 道单选题 + 2 道多选题）+ 1 道思考题
2. 选择题覆盖所有学习目标，难度分布：基础 40%、中级 40%、进阶 20%
3. 每道选择题提供 4 个选项，其中 1-2 个正确答案
4. 思考题要求结合实际场景进行分析或设计
5. 每道题必须附带详细的答案解析
6. 思考题附带评分标准要点（5个维度，每维度2分，满分10分）

输出必须为合法的 JSON，格式如下：
{
  "title": "第{week}周：{theme}",
  "description": "本测验检验你对{theme}的掌握程度",
  "time_limit_minutes": 30,
  "passing_score": 60,
  "questions": [
    {
      "order_num": 1,
      "question_type": "SINGLE_CHOICE",
      "content": "题目内容（支持 Markdown）",
      "options": [
        { "key": "A", "content": "选项A" },
        { "key": "B", "content": "选项B" },
        { "key": "C", "content": "选项C" },
        { "key": "D", "content": "选项D" }
      ],
      "correct_answer": "B",
      "explanation": "详细解析...",
      "xp_reward": 5
    },
    {
      "order_num": 9,
      "question_type": "MULTI_CHOICE",
      "content": "题目内容",
      "options": [
        { "key": "A", "content": "选项A" },
        { "key": "B", "content": "选项B" },
        { "key": "C", "content": "选项C" },
        { "key": "D", "content": "选项D" }
      ],
      "correct_answer": ["A", "C"],
      "explanation": "详细解析...",
      "xp_reward": 10
    },
    {
      "order_num": 11,
      "question_type": "THINKING",
      "content": "思考题内容...",
      "options": null,
      "correct_answer": null,
      "explanation": "评分标准：1. 概念准确性(2分) 2. 方案完整性(2分) 3. 代码示例(2分) 4. 最佳实践(2分) 5. 创新性(2分)",
      "xp_reward": 10
    }
  ]
}
```

- **AI 生成失败处理**：若 AI 生成失败或 JSON 解析失败，重试 1 次；若仍失败，使用预设的通用题目模板生成。

#### 3.2.2 手动管理（管理员预留）

管理员可通过后台接口手动创建、编辑、删除测验和题目（MVP 阶段预留接口，不做前端管理页面）。

---

### 3.3 考试流程

#### 3.3.1 开始考试

- 用户在路线图详情页点击某周的"开始测验"按钮。
- 若该周已有进行中的考试（未提交），则恢复之前的作答进度。
- 若该周已有完成的考试记录，显示"重新考试"选项，点击后开始新的考试。
- 系统创建考试记录，记录 `started_at`。

#### 3.3.2 答题界面

- **顶部**：测验标题、倒计时（若设置了时间限制）、进度指示器（第 N/M 题）。
- **题目区域**：
  - 选择题：渲染为单选/多选卡片，点击选项即可选择，支持键盘操作（A/B/C/D 快捷键）。
  - 思考题：渲染为 Markdown 题目 + 多行文本输入框（支持 Markdown 预览）。
- **导航**：底部"上一题"、"下一题"按钮，右侧题目列表快速跳转。
- **交卷按钮**：点击后弹出确认对话框，提示"还有 N 道题未作答，确定交卷吗？"

#### 3.3.3 提交流程

1. 前端收集所有答案，发送给后端。
2. 后端处理流程：
   a. 计算选择题得分：每道选择题 `xp_reward` 分（满分按题目数比例折算为100分）。
   b. 选择题答对即得满分，答错为 0 分。
   c. 将所有思考题的回答打包发送给 AI 进行评分。
   d. AI 返回评分结果后，计算思考题得分。
   e. 总分 = (选择题得分 + 思考题得分) / 总分 * 100。
   f. 更新考试记录，保存答案和 AI 评测详情。
3. 若用户答对题目，累加 XP（按各题目 `xp_reward`）。

#### 3.3.4 AI 评分思考题

- **AI Prompt 模板**：

```
你是一位公正的 AI 评分专家。请根据以下评分标准，对学习者的回答进行评分。

题目：{question_content}
评分标准：{explanation}

学习者回答：{user_answer}

请按以下维度评分（每个维度 0-2 分，满分 10 分）：
1. 概念准确性
2. 方案完整性
3. 代码/示例质量（如适用）
4. 最佳实践遵循
5. 创新性/深度

返回 JSON 格式：
{
  "score": <int 0-10>,
  "feedback": "总体评价...",
  "dimension_scores": {
    "概念准确性": <int 0-2>,
    "方案完整性": <int 0-2>,
    "代码示例质量": <int 0-2>,
    "最佳实践遵循": <int 0-2>,
    "创新性深度": <int 0-2>
  }
}
```

---

### 3.4 考试结果页

提交后立即展示结果页面：

#### 3.4.1 总览卡片

| 内容 | 说明 |
|------|------|
| 最终得分 | 大字展示，带颜色（根据等级） |
| 通过/未通过 | 图标 + 文字 |
| 选择题正确率 | 进度条 + 文字（如 "8/10"） |
| 思考题平均分 | 分数 + 满分（如 "8.5/10"） |
| 用时 | 从开始到提交的时间 |
| 获得 XP | 本次获得的总 XP |

#### 3.4.2 题目回顾

- 逐题展示：
  - **选择题**：显示题目、用户选择、正确答案、解析。答对显示绿色对号，答错显示红色叉号 + 正确答案。
  - **思考题**：显示题目、用户回答、AI 评分、AI 反馈、各维度分数雷达图。

---

### 3.5 考试记录

#### 3.5.1 列表页

- 入口：路线图详情页 → "考试记录" Tab；个人中心 → "我的考试"。
- 列表字段：测验标题、对应周次、得分、通过状态、完成时间、用时。
- 支持按时间倒序排列（最近在前）。

#### 3.5.2 历史详情

- 点击某条记录，进入完整的考试回顾（与 3.4 考试结果页布局一致，但只读）。

---

### 3.6 路线图掌握程度展示

#### 3.6.1 路线图时间轴

在路线图时间轴的每一周卡片上，新增掌握程度标签：

```
┌─────────────────────────────────────┐
│ Week 1: Python基础与LLM入门          │
│ ✅ 已完成 · 掌握程度: 🟢 精通 (95分) │
│ [查看详情] [开始测验]                │
└─────────────────────────────────────┘
```

- 未测试：显示"📝 待测验"灰色标签，点击可进入测验。
- 已测试：显示等级标签 + 分数，点击可查看考试记录。

#### 3.6.2 路线图整体掌握度

在路线图顶部新增整体掌握度仪表盘：

```
┌───────────────────────────────────────────────┐
│ 学习掌握度                                      │
│ ┌──────┬──────┬──────┬──────┬──────┐          │
│ │ 8 周 │ 5 已测│ 80分 │ 🟢 3  │ 🔴 1 │          │
│ │ 总计 │ 已测试│ 平均分│ 精通   │ 不及格│          │
│ └──────┴──────┴──────┴──────┴──────┘          │
│ ████████████████░░░░ 整体掌握度: 80%           │
└───────────────────────────────────────────────┘
```

---

### 3.7 成长系统联动

| 事件 | XP 奖励 | 说明 |
|------|---------|------|
| 参加测验（提交即得） | +10 XP | 鼓励参与 |
| 每道选择题答对 | +5 XP | 按题目 `xp_reward` 配置 |
| 思考题得分 ≥ 7 | +10 XP | 鼓励深度思考 |
| 考试通过（>= passing_score） | +30 XP | 额外通过奖励 |
| 某周达到"精通"（>= 90分） | +50 XP | 额外精通成就 |
| 首次通过任意测验 | 解锁成就"初试锋芒" | 一次性 |
| 连续 3 周"良好"以上 | 解锁成就"学以致用" | 一次性 |
| 所有周"精通" | 解锁成就"满分大师" | 一次性 |

---

## 4. 数据模型（新增表）

### 4.1 ER 关系

```
users ──< exam_records >── exams ──< exam_questions
  │                           │
  │                           ├── roadmap_id → roadmaps
  │
  └── growth (已有)
```

### 4.2 DDL 设计

```sql
-- 测验/考试定义
CREATE TABLE exams (
    id              bigint PRIMARY KEY,
    roadmap_id      bigint NOT NULL REFERENCES roadmaps(id),
    week            int NOT NULL,
    title           varchar(200) NOT NULL,
    description     text,
    question_count  int NOT NULL DEFAULT 0,
    time_limit_minutes int NOT NULL DEFAULT 0,
    passing_score   int NOT NULL DEFAULT 60,
    created_at      timestamp NOT NULL DEFAULT now()
);

-- 题目
CREATE TABLE exam_questions (
    id              bigint PRIMARY KEY,
    exam_id         bigint NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    question_type   varchar(20) NOT NULL,
    order_num       int NOT NULL,
    content         text NOT NULL,
    options         jsonb,
    correct_answer  jsonb,
    explanation     text,
    xp_reward       int NOT NULL DEFAULT 5,
    created_at      timestamp NOT NULL DEFAULT now(),
    CONSTRAINT chk_question_type CHECK (question_type IN ('SINGLE_CHOICE', 'MULTI_CHOICE', 'THINKING'))
);

-- 考试记录
CREATE TABLE exam_records (
    id              bigint PRIMARY KEY,
    user_id         bigint NOT NULL REFERENCES users(id),
    exam_id         bigint NOT NULL REFERENCES exams(id),
    score           int NOT NULL DEFAULT 0,
    passed          boolean NOT NULL DEFAULT false,
    total_questions int NOT NULL DEFAULT 0,
    correct_count   int NOT NULL DEFAULT 0,
    answers         jsonb,
    ai_evaluation   jsonb,
    started_at      timestamp NOT NULL,
    completed_at    timestamp,
    created_at      timestamp NOT NULL DEFAULT now()
);

-- 索引
CREATE INDEX idx_exams_roadmap_week ON exams(roadmap_id, week);
CREATE INDEX idx_exam_questions_exam ON exam_questions(exam_id, order_num);
CREATE INDEX idx_exam_records_user ON exam_records(user_id, created_at DESC);
CREATE INDEX idx_exam_records_exam ON exam_records(exam_id);
CREATE INDEX idx_exam_records_user_exam ON exam_records(user_id, exam_id);

-- 路线图增加掌握程度字段
ALTER TABLE roadmaps ADD COLUMN mastery_score int DEFAULT NULL;
ALTER TABLE roadmaps ADD COLUMN mastery_level varchar(20) DEFAULT 'NOT_TESTED';
ALTER TABLE roadmaps ADD COLUMN last_exam_at timestamp DEFAULT NULL;
```

---

## 5. API 设计（RESTful）

基础路径 `/api/v1`

### 5.1 测验管理

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/exams/generate` | 为指定路线图的所有周生成测验 | ✅ |
| GET | `/exams/roadmap/{roadmapId}` | 获取路线图的所有测验列表 | ✅ |
| GET | `/exams/{examId}` | 获取测验详情（含题目，不含正确答案） | ✅ |
| GET | `/exams/{examId}/questions` | 获取测验题目列表（不含正确答案） | ✅ |
| POST | `/exams` | 手动创建测验（管理员预留） | ✅ + ADMIN |
| PUT | `/exams/{examId}` | 更新测验信息 | ✅ + ADMIN |
| DELETE | `/exams/{examId}` | 删除测验 | ✅ + ADMIN |

### 5.2 考试进行

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/exams/{examId}/start` | 开始考试，返回或创建考试记录 | ✅ |
| POST | `/exams/{examId}/submit` | 提交考试答案 | ✅ |
| GET | `/exams/{examId}/progress` | 获取进行中的考试进度（断点恢复） | ✅ |

### 5.3 考试记录

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/exam-records/my` | 我的考试记录列表（分页） | ✅ |
| GET | `/exam-records/{recordId}` | 考试记录详情（含答案回顾） | ✅ |
| GET | `/exam-records/roadmap/{roadmapId}/summary` | 路线图考试汇总（各周掌握程度） | ✅ |

### 5.4 掌握程度

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/roadmaps/{roadmapId}/mastery` | 获取路线图整体及各周掌握程度 | ✅ |

### 5.5 接口详细定义

#### POST `/exams/generate`

**请求体**：
```json
{
  "roadmapId": "1234567890"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "generated_count": 8,
    "exams": [
      {
        "id": "2345678901",
        "week": 1,
        "title": "第1周：Python基础与LLM入门",
        "question_count": 11,
        "time_limit_minutes": 30,
        "passing_score": 60
      }
    ]
  }
}
```

#### POST `/exams/{examId}/start`

**响应**：
```json
{
  "success": true,
  "data": {
    "record_id": "3456789012",
    "exam_id": "2345678901",
    "started_at": "2026-06-02T10:00:00Z",
    "time_limit_minutes": 30,
    "questions": [
      {
        "id": "4567890123",
        "order_num": 1,
        "question_type": "SINGLE_CHOICE",
        "content": "以下哪个是 Python 的特点？",
        "options": [
          { "key": "A", "content": "静态类型语言" },
          { "key": "B", "content": "解释型语言" },
          { "key": "C", "content": "只能面向过程编程" },
          { "key": "D", "content": "不支持跨平台" }
        ],
        "xp_reward": 5
      }
    ]
  }
}
```

#### POST `/exams/{examId}/submit`

**请求体**：
```json
{
  "record_id": "3456789012",
  "answers": [
    {
      "question_id": "4567890123",
      "user_answer": "B"
    },
    {
      "question_id": "4567890124",
      "user_answer": ["A", "C"]
    },
    {
      "question_id": "4567890134",
      "user_answer": "我认为 Spring AI 的核心优势在于..."
    }
  ]
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "record_id": "3456789012",
    "score": 85,
    "passed": true,
    "correct_count": 8,
    "total_questions": 11,
    "xp_earned": 75,
    "thinking_evaluation": {
      "thinking_questions": [
        {
          "question_id": 4567890134,
          "score": 8,
          "max_score": 10,
          "feedback": "回答较好，但缺少对 Spring AI 整合方式的描述...",
          "dimension_scores": {
            "概念准确性": 2,
            "方案完整性": 2,
            "代码示例质量": 1,
            "最佳实践遵循": 2,
            "创新性深度": 1
          }
        }
      ],
      "overall_comment": "整体表现良好，建议重点复习 Spring AI 集成部分。"
    },
    "mastery_level": "GOOD"
  }
}
```

#### GET `/exam-records/my`

**查询参数**：`page`, `size`（可选，不传返回全部）

**响应**（分页模式）：
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "3456789012",
        "exam_id": "2345678901",
        "exam_title": "第1周：Python基础与LLM入门",
        "week": 1,
        "score": 85,
        "passed": true,
        "correct_count": 8,
        "total_questions": 11,
        "time_spent_minutes": 25,
        "completed_at": "2026-06-02T10:25:00Z"
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 5,
    "totalPages": 1,
    "hasNext": false
  }
}
```

#### GET `/roadmaps/{roadmapId}/mastery`

**响应**：
```json
{
  "success": true,
  "data": {
    "overall_score": 82,
    "overall_level": "GOOD",
    "tested_weeks": 5,
    "total_weeks": 8,
    "week_mastery": [
      {
        "week": 1,
        "score": 95,
        "level": "MASTERY",
        "attempts": 1,
        "best_score": 95,
        "last_exam_at": "2026-06-01T10:00:00Z"
      },
      {
        "week": 2,
        "score": 70,
        "level": "PASS",
        "attempts": 2,
        "best_score": 70,
        "last_exam_at": "2026-06-02T10:00:00Z"
      },
      {
        "week": 3,
        "score": null,
        "level": "NOT_TESTED",
        "attempts": 0,
        "best_score": null,
        "last_exam_at": null
      }
    ]
  }
}
```

---

## 6. AI 服务交互

### 6.1 测验生成 AI 调用

| 项 | 说明 |
|----|------|
| 触发 | 路线图生成完成后自动调用 |
| 输入 | 路线图各周的 theme, goals, recommended_projects |
| 输出 | 结构化 JSON（测验 + 题目列表） |
| 模型 | Qwen-Max（需要高质量出题能力） |
| 超时 | 60s（每场测验生成约需 10-30s） |
| 重试 | 最多 2 次 |
| 降级 | AI 失败时使用预设通用题目模板 |

### 6.2 思考题 AI 评分

| 项 | 说明 |
|----|------|
| 触发 | 用户提交考试后，有思考题时调用 |
| 输入 | 题目内容、评分标准、用户回答 |
| 输出 | 评分 JSON（分数 + 反馈 + 维度分数） |
| 模型 | Qwen-Max |
| 超时 | 30s |
| 重试 | 最多 2 次 |
| 降级 | AI 失败时思考题默认给 50% 分数 |

---

## 7. 非功能性需求

| 需求 | 指标 |
|------|------|
| 考试提交响应时间 | 选择题评分 < 200ms，含 AI 评分 < 10s |
| 测验生成时间 | 单周测验 < 30s，全部路线图测验 < 120s |
| 答题本地缓存 | 浏览器刷新后可恢复答题进度（本地存储 + 服务端双重保障） |
| 时间限制 | 前端倒计时为准，服务端记录实际用时做校验 |
| 幂等性 | 同一考试开始时，若已有未完成记录则恢复，不重复创建 |
| 防作弊 | 题目顺序随机化，选项顺序随机化（前端渲染时打乱） |

---

## 8. 验收标准（Given/When/Then）

### AC-1：自动生成测验

- **Given** 用户已生成一个包含 8 周的学习路线图
- **When** 路线图生成完成
- **Then** 系统自动为每一周生成一场测验，每场包含 8 道单选题 + 2 道多选题 + 1 道思考题

### AC-2：开始考试

- **Given** 用户在路线图第 1 周卡片上
- **When** 点击"开始测验"
- **Then** 进入答题界面，显示第 1 道选择题，顶部显示倒计时（30分钟）和进度（1/11）

### AC-3：答题与导航

- **Given** 用户正在回答第 1 道题
- **When** 用户点击选项 B 并点击"下一题"
- **Then** 选项 B 被选中并高亮，界面切换到第 2 道题

### AC-4：提交考试

- **Given** 用户回答完所有题目
- **When** 点击"交卷"并确认
- **Then** 显示加载动画（等待 AI 评分），完成后展示结果页：得分 85，通过，选择题正确 8/10，思考题得分 8/10

### AC-5：考试记录

- **Given** 用户已完成一次考试
- **When** 进入"考试记录"页面
- **Then** 显示考试历史列表，最新记录在最上方，包含标题、分数、时间

### AC-6：掌握程度更新

- **Given** 用户在第 1 周测验中获得 95 分
- **When** 返回路线图页面
- **Then** 第 1 周卡片显示"🟢 精通 (95分)"，整体掌握度更新为"85分"

### AC-7：重考

- **Given** 用户第 2 周测验得分为 55 分（不及格）
- **When** 再次点击"开始测验"
- **Then** 系统提示"你已有历史记录，重新考试将覆盖之前的最高分"，确认后开始新考试

### AC-8：时间限制

- **Given** 用户正在进行测验，倒计时还剩 5 分钟
- **When** 倒计时归零
- **Then** 自动提交当前已作答的题目，未作答的按错误处理

---

## 9. UI 设计要点

### 9.1 配色方案

沿用现有暗色主题：

| 状态 | 背景色 | 前景色 | 用途 |
|------|--------|--------|------|
| 未测试 | `#1C2333` | `#8B949E` | 灰色标签 |
| 及格 | `rgba(250,204,21,0.1)` | `#FACC15` | 黄色标签 |
| 良好 | `rgba(59,130,246,0.1)` | `#3B82F6` | 蓝色标签 |
| 精通 | `rgba(34,197,94,0.1)` | `#22C55E` | 绿色标签 |
| 不及格 | `rgba(239,68,68,0.1)` | `#EF4444` | 红色标签 |

### 9.2 关键页面

| 页面 | 路由 | 说明 |
|------|------|------|
| 答题页 | `/roadmap/{id}/exam/{examId}` | 考试进行页面 |
| 考试结果页 | `/roadmap/{id}/exam/{examId}/result/{recordId}` | 考试结果与回顾 |
| 考试记录页 | `/roadmap/{id}/exam-records` | 所有考试记录列表 |
| 路线图掌握度 | `/roadmap` | 路线图时间轴上内嵌 |

---

## 10. 开发优先级与里程碑

| 阶段 | 功能 | 依赖 |
|------|------|------|
| P0-1 | 数据库表创建 + CRUD API | 无 |
| P0-2 | AI 测验生成 | P0-1, AI 服务 |
| P0-3 | 答题界面 + 提交流程 | P0-1 |
| P0-4 | AI 思考题评分 | P0-1, AI 服务 |
| P0-5 | 考试结果页 + 记录列表 | P0-3, P0-4 |
| P0-6 | 路线图掌握程度展示 | P0-5 |
| P0-7 | 成长系统联动（XP + 成就） | P0-5, 成长模块 |
| P1 | 管理后台题目管理 | P0-1 |
| P1 | 时间限制 + 自动交卷 | P0-3 |

---
