-- V22: 少儿编程端（Kids）核心表
-- 目标用户：8-15岁学生 + 家长
-- 核心功能：动画课程、图形化编程、竞赛题库、成长勋章、家长监控

-- ============================================================
-- 1. kids_learning_paths 少儿学习路径
-- 与 campus 的 learning_paths 分离，面向少儿阶段设计
-- ============================================================
CREATE TABLE IF NOT EXISTS kids_learning_paths (
    id              BIGINT NOT NULL,
    slug            VARCHAR(60) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    icon            VARCHAR(20),                          -- emoji 图标
    stage           VARCHAR(20) NOT NULL,                 -- 'SCRATCH' / 'PYTHON' / 'ALGORITHM' / 'AI_CREATION' / 'COMPETITION'
    duration_weeks  INTEGER NOT NULL DEFAULT 12,
    level_from      VARCHAR(10) NOT NULL DEFAULT 'L0',
    level_to        VARCHAR(10) NOT NULL DEFAULT 'L3',
    student_count   INTEGER NOT NULL DEFAULT 0,           -- 报名人数（冗余字段，定期刷新）
    sort_order      INTEGER NOT NULL DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_kids_paths_status ON kids_learning_paths(status, sort_order);
CREATE INDEX IF NOT EXISTS idx_kids_paths_stage ON kids_learning_paths(stage, status);

-- ============================================================
-- 2. competition_problems 竞赛题库（少儿专属）
-- CSP/NOI/蓝桥杯等青少年编程竞赛真题与模拟题
-- ============================================================
CREATE TABLE IF NOT EXISTS competition_problems (
    id              BIGINT NOT NULL,
    slug            VARCHAR(80) NOT NULL UNIQUE,
    title           VARCHAR(300) NOT NULL,
    difficulty      VARCHAR(20) NOT NULL,                 -- 'PRIMARY' / 'JUNIOR' / 'SENIOR'（小学/初中/高中）
    category        VARCHAR(50) NOT NULL,                 -- 'CSP' / 'NOI' / 'BLUE_BRIDGE' / 'CODING_CONTEST'
    content         TEXT NOT NULL,                        -- 题目描述（Markdown）
    input_format    TEXT,                                 -- 输入格式说明
    output_format   TEXT,                                 -- 输出格式说明
    sample_input    TEXT,                                 -- 样例输入
    sample_output   TEXT,                                 -- 样例输出
    hint            TEXT,                                 -- 提示（少儿友好）
    time_limit_ms   INTEGER NOT NULL DEFAULT 1000,        -- 时间限制（毫秒）
    memory_limit_mb INTEGER NOT NULL DEFAULT 256,         -- 内存限制（MB）
    sort_order      INTEGER NOT NULL DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_comp_problems_difficulty ON competition_problems(difficulty, status);
CREATE INDEX IF NOT EXISTS idx_comp_problems_category ON competition_problems(category, status);

-- ============================================================
-- 3. competition_submissions 竞赛代码提交记录
-- ============================================================
CREATE TABLE IF NOT EXISTS competition_submissions (
    id              BIGINT NOT NULL,
    user_id         BIGINT NOT NULL,
    problem_id      BIGINT NOT NULL REFERENCES competition_problems(id) ON DELETE CASCADE,
    language        VARCHAR(20) NOT NULL,
    source_code     TEXT NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    passed_count    INTEGER NOT NULL DEFAULT 0,
    total_count     INTEGER NOT NULL DEFAULT 0,
    runtime_ms      INTEGER,
    memory_kb       INTEGER,
    submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_comp_submissions_user ON competition_submissions(user_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_comp_submissions_problem ON competition_submissions(problem_id);

-- ============================================================
-- 4. growth_badges 成长勋章定义
-- ============================================================
CREATE TABLE IF NOT EXISTS growth_badges (
    id              BIGINT NOT NULL,
    slug            VARCHAR(60) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    icon            VARCHAR(20),                          -- emoji 图标
    category        VARCHAR(40) NOT NULL,                 -- 'COURSE' / 'PRACTICE' / 'COMPETITION' / 'STREAK'
    requirement     INTEGER NOT NULL DEFAULT 1,           -- 达成条件数量
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_badges_category ON growth_badges(category, sort_order);

-- ============================================================
-- 5. user_badges 用户已获得勋章
-- ============================================================
CREATE TABLE IF NOT EXISTS user_badges (
    id              BIGINT NOT NULL,
    user_id         BIGINT NOT NULL,
    badge_id        BIGINT NOT NULL REFERENCES growth_badges(id) ON DELETE CASCADE,
    earned_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    UNIQUE (user_id, badge_id)
);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id, earned_at DESC);

-- ============================================================
-- 6. parent_monitor_logs 家长监控记录
-- 每日学习时长与活动统计
-- ============================================================
CREATE TABLE IF NOT EXISTS parent_monitor_logs (
    id              BIGINT NOT NULL,
    parent_user_id  BIGINT NOT NULL,
    child_user_id   BIGINT NOT NULL,
    daily_minutes   INTEGER NOT NULL DEFAULT 0,           -- 当日学习分钟数
    log_date        DATE NOT NULL,
    activities      JSONB,                                -- {"video":30, "practice":20, "competition":10}
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    UNIQUE (child_user_id, log_date)
);
CREATE INDEX IF NOT EXISTS idx_parent_monitor_child ON parent_monitor_logs(child_user_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_parent_monitor_parent ON parent_monitor_logs(parent_user_id);

-- ============================================================
-- 7. kids_ai_tutor_sessions AI 助教对话会话（少儿版）
-- 与 coach_sessions 分离，支持少儿专属 Prompt
-- ============================================================
CREATE TABLE IF NOT EXISTS kids_ai_tutor_sessions (
    id              BIGINT NOT NULL,
    user_id         BIGINT NOT NULL,
    title           VARCHAR(160) NOT NULL DEFAULT '新对话',
    lesson_id       BIGINT,                               -- 关联课时（可为空）
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_kids_tutor_user ON kids_ai_tutor_sessions(user_id, created_at DESC);

-- ============================================================
-- 8. kids_ai_tutor_messages AI 助教对话消息
-- ============================================================
CREATE TABLE IF NOT EXISTS kids_ai_tutor_messages (
    id              BIGINT NOT NULL,
    session_id      BIGINT NOT NULL REFERENCES kids_ai_tutor_sessions(id) ON DELETE CASCADE,
    role            VARCHAR(20) NOT NULL,                 -- 'user' / 'assistant'
    content         TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_kids_tutor_msg_session ON kids_ai_tutor_messages(session_id, created_at);

-- ============================================================
-- 种子数据：少儿学习路径
-- ============================================================
INSERT INTO kids_learning_paths (id, slug, name, description, icon, stage, duration_weeks, level_from, level_to, sort_order, status)
VALUES
    (1001000001, 'scratch-beginner', 'Scratch 图形化编程入门', '用拖拽积木的方式学习编程思维，适合零基础小朋友', '🧩', 'SCRATCH', 8, 'L0', 'L1', 1, 'PUBLISHED'),
    (1001000002, 'python-kids', 'Python 趣味编程', '从 Scratch 过渡到文字编程，用 Python 创作小游戏', '🐍', 'PYTHON', 12, 'L1', 'L2', 2, 'PUBLISHED'),
    (1001000003, 'algorithm-junior', '算法思维启蒙', '学习基础算法思想，培养逻辑思维能力', '🧠', 'ALGORITHM', 10, 'L2', 'L3', 3, 'PUBLISHED'),
    (1001000004, 'ai-creation', 'AI 小创客', '用 AI 工具创作自己的作品，体验人工智能魔力', '🤖', 'AI_CREATION', 8, 'L2', 'L3', 4, 'PUBLISHED'),
    (1001000005, 'csp-preparation', 'CSP 竞赛冲刺', '针对 CSP-J/S 竞赛的专项训练，冲刺省一等奖', '🏆', 'COMPETITION', 16, 'L3', 'L4', 5, 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 种子数据：竞赛题目（示例）
-- ============================================================
INSERT INTO competition_problems (id, slug, title, difficulty, category, content, input_format, output_format, sample_input, sample_output, hint, time_limit_ms, memory_limit_mb, sort_order, status)
VALUES
    (1002000001, 'sum-two-numbers', '两数之和', 'PRIMARY', 'CSP',
     '输入两个整数 a 和 b，输出它们的和。',
     '一行包含两个整数 a 和 b，用空格分隔。',
     '一个整数，表示 a + b 的结果。',
     '3 5', '8',
     '使用 input() 读取输入，用 split() 分割字符串。', 1000, 256, 1, 'PUBLISHED'),
    (1002000002, 'print-hello', '你好世界', 'PRIMARY', 'CSP',
     '在屏幕上输出 "Hello, World!"。',
     '无输入。',
     '输出一行：Hello, World!',
     '', 'Hello, World!',
     '使用 print() 函数输出字符串。', 1000, 256, 2, 'PUBLISHED'),
    (1002000003, 'even-or-odd', '判断奇偶', 'PRIMARY', 'CSP',
     '输入一个整数 n，判断它是奇数还是偶数。如果是偶数输出 "even"，如果是奇数输出 "odd"。',
     '一行一个整数 n。',
     '一行，"even" 或 "odd"。',
     '4', 'even',
     '使用取模运算符 %：n % 2 == 0 表示偶数。', 1000, 256, 3, 'PUBLISHED'),
    (1002000004, 'fibonacci', '斐波那契数列', 'JUNIOR', 'CSP',
     '输入一个正整数 n（1 ≤ n ≤ 20），输出斐波那契数列的第 n 项。斐波那契数列定义为：F(1)=1, F(2)=1, F(n)=F(n-1)+F(n-2)。',
     '一行一个正整数 n。',
     '一行，斐波那契数列第 n 项的值。',
     '6', '8',
     '可以用循环或递归实现。注意 n 的范围很小，递归也能通过。', 1000, 256, 4, 'PUBLISHED'),
    (1002000005, 'bubble-sort', '冒泡排序', 'JUNIOR', 'NOI',
     '输入一个整数 n（1 ≤ n ≤ 100），然后输入 n 个整数，使用冒泡排序将它们从小到大排序并输出。',
     '第一行一个整数 n，第二行 n 个整数。',
     '一行 n 个排序后的整数，用空格分隔。',
     '5\n5 3 8 1 2', '1 2 3 5 8',
     '冒泡排序：重复遍历数组，相邻元素比较并交换。', 2000, 256, 5, 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 种子数据：成长勋章
-- ============================================================
INSERT INTO growth_badges (id, slug, name, description, icon, category, requirement, sort_order)
VALUES
    (1003000001, 'first-lesson', '初学者', '完成第一个课时', '🌟', 'COURSE', 1, 1),
    (1003000002, 'five-lessons', '勤奋之星', '完成 5 个课时', '⭐', 'COURSE', 5, 2),
    (1003000003, 'first-code', '代码小达人', '首次提交代码通过', '💻', 'PRACTICE', 1, 3),
    (1003000004, 'ten-codes', '编程高手', '累计 10 次代码提交通过', '🏅', 'PRACTICE', 10, 4),
    (1003000005, 'first-competition', '竞赛新手', '首次完成竞赛题目', '🎯', 'COMPETITION', 1, 5),
    (1003000006, 'streak-7', '坚持不懈', '连续学习 7 天', '🔥', 'STREAK', 7, 6),
    (1003000007, 'streak-30', '月度之星', '连续学习 30 天', '👑', 'STREAK', 30, 7)
ON CONFLICT (id) DO NOTHING;
