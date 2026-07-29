-- Flyway: V12__interview.sql
-- Interview Training Camp: question bank, sets, mock interviews, answers, skill profile

-- 面试题库
CREATE TABLE interview_questions (
    id              bigint PRIMARY KEY,
    category        varchar(50) NOT NULL,   -- 'ALGORITHM','SYSTEM_DESIGN','JAVA','AI','BEHAVIORAL','DATABASE'
    sub_category    varchar(100),           -- 'TREE','DYNAMIC_PROGRAMMING','KAFKA' 等
    difficulty      varchar(20) NOT NULL,   -- 'EASY','MEDIUM','HARD'
    title           varchar(500) NOT NULL,
    content         text NOT NULL,          -- 题目详细描述（Markdown）
    expected_answer text,                   -- 参考答案（仅内部可见，不直接展示给用户）
    key_points      jsonb NOT NULL DEFAULT '[]',  -- ["时间复杂度","空间复杂度","边界处理"]
    companies       jsonb NOT NULL DEFAULT '[]',  -- ["阿里巴巴","字节跳动"]
    tags            jsonb NOT NULL DEFAULT '[]',
    source          varchar(100),           -- '真题' / '变形题' / '原创'
    status          varchar(20) NOT NULL DEFAULT 'ACTIVE',
    view_count      bigint NOT NULL DEFAULT 0,
    created_at      timestamp NOT NULL DEFAULT now(),
    updated_at      timestamp NOT NULL DEFAULT now()
);

-- 面试套题（一次模拟面试的题目集合）
CREATE TABLE interview_sets (
    id              bigint PRIMARY KEY,
    title           varchar(200) NOT NULL,  -- "字节跳动后端一面模拟"
    description     text,
    target_role     varchar(100),           -- "Java后端工程师"
    difficulty      varchar(20) NOT NULL,
    question_ids    jsonb NOT NULL,          -- [id1, id2, id3...]
    duration_minutes int NOT NULL DEFAULT 45,
    status          varchar(20) NOT NULL DEFAULT 'ACTIVE',
    created_at      timestamp NOT NULL DEFAULT now()
);

-- 模拟面试记录
CREATE TABLE mock_interviews (
    id              bigint PRIMARY KEY,
    user_id         bigint NOT NULL REFERENCES users(id),
    interview_set_id bigint REFERENCES interview_sets(id),
    mode            varchar(20) NOT NULL,   -- 'SET'（套题）/ 'RANDOM'（随机）/ 'WEAK'（薄弱项）
    status          varchar(20) NOT NULL DEFAULT 'IN_PROGRESS',  -- IN_PROGRESS/COMPLETED/ABANDONED
    overall_score   int,                    -- 0-100
    ai_summary      text,                   -- AI 整体评价
    started_at      timestamp NOT NULL DEFAULT now(),
    completed_at    timestamp,
    duration_seconds int
);

-- 单题作答记录
CREATE TABLE mock_interview_answers (
    id                bigint PRIMARY KEY,
    mock_interview_id bigint NOT NULL REFERENCES mock_interviews(id) ON DELETE CASCADE,
    question_id       bigint NOT NULL REFERENCES interview_questions(id),
    question_order    int NOT NULL,
    user_answer       text NOT NULL,
    ai_score          int,                  -- 0-10
    ai_feedback       text,
    ai_key_points_hit jsonb,                -- {"时间复杂度": true, "边界处理": false}
    thinking_seconds  int,                  -- 用户思考时间
    answered_at       timestamp NOT NULL DEFAULT now()
);

-- 用户面试能力画像（按分类）
CREATE TABLE interview_skill_profile (
    id              bigint PRIMARY KEY,
    user_id         bigint NOT NULL REFERENCES users(id),
    category        varchar(50) NOT NULL,
    avg_score       numeric(4,1) NOT NULL DEFAULT 0,
    interview_count int NOT NULL DEFAULT 0,
    last_updated    timestamp NOT NULL DEFAULT now(),
    UNIQUE (user_id, category)
);

-- 索引
CREATE INDEX idx_interview_questions_category ON interview_questions(category, difficulty, status);
CREATE INDEX idx_mock_interviews_user ON mock_interviews(user_id, started_at DESC);
CREATE INDEX idx_mock_answers_interview ON mock_interview_answers(mock_interview_id, question_order);
CREATE INDEX idx_skill_profile_user ON interview_skill_profile(user_id);
