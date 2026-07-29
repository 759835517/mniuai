-- V15: Campus 大学生端核心表
-- 1. learning_paths 学习路径
CREATE TABLE IF NOT EXISTS learning_paths (
    id              BIGINT NOT NULL,
    slug            VARCHAR(60) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    icon            VARCHAR(20),
    duration_weeks   INTEGER NOT NULL DEFAULT 12,
    level_from      VARCHAR(10) NOT NULL DEFAULT 'L0',
    level_to        VARCHAR(10) NOT NULL DEFAULT 'L3',
    sort_order      INTEGER NOT NULL DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

-- 2. path_courses 路径-课程关联（排序）
CREATE TABLE IF NOT EXISTS path_courses (
    id              BIGINT NOT NULL,
    path_id         BIGINT NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    course_id       BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    required        BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    UNIQUE (path_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_path_courses_path ON path_courses(path_id, sort_order);

-- 3. practice_problems 编程练习题目
CREATE TABLE IF NOT EXISTS practice_problems (
    id              BIGINT NOT NULL,
    slug            VARCHAR(80) NOT NULL UNIQUE,
    title           VARCHAR(200) NOT NULL,
    description     TEXT NOT NULL,
    difficulty      VARCHAR(20) NOT NULL,
    category        VARCHAR(60),
    tags            TEXT,
    starter_code    TEXT,
    solution_code   TEXT,
    test_cases      TEXT NOT NULL DEFAULT '[]',
    time_limit_sec  INTEGER NOT NULL DEFAULT 30,
    memory_limit_mb INTEGER NOT NULL DEFAULT 256,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON practice_problems(difficulty, status);

-- 4. code_submissions 代码提交记录
CREATE TABLE IF NOT EXISTS code_submissions (
    id              BIGINT NOT NULL,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id      BIGINT NOT NULL REFERENCES practice_problems(id) ON DELETE CASCADE,
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
CREATE INDEX IF NOT EXISTS idx_submissions_user ON code_submissions(user_id, submitted_at DESC);

-- 5. path_enrollments 路径报名
CREATE TABLE IF NOT EXISTS path_enrollments (
    id              BIGINT NOT NULL,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    path_id         BIGINT NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    enrolled_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at    TIMESTAMPTZ,
    PRIMARY KEY (id),
    UNIQUE (user_id, path_id)
);
CREATE INDEX IF NOT EXISTS idx_path_enrollments_user ON path_enrollments(user_id);

-- 6. guarantee_progress 对赌进度
CREATE TABLE IF NOT EXISTS guarantee_progress (
    id                      BIGINT NOT NULL,
    user_id                 BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    path_id                 BIGINT NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    course_completion_pct   NUMERIC(5,2) NOT NULL DEFAULT 0,
    practice_completed      INTEGER NOT NULL DEFAULT 0,
    practice_passed         INTEGER NOT NULL DEFAULT 0,
    projects_submitted      INTEGER NOT NULL DEFAULT 0,
    projects_approved       INTEGER NOT NULL DEFAULT 0,
    interview_rounds        INTEGER NOT NULL DEFAULT 0,
    resume_generated        BOOLEAN NOT NULL DEFAULT FALSE,
    job_applications        INTEGER NOT NULL DEFAULT 0,
    is_employed             BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    UNIQUE (user_id, path_id)
);
CREATE INDEX IF NOT EXISTS idx_guarantee_user ON guarantee_progress(user_id);
