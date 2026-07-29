-- V17__sandbox_judge0.sql
-- Judge0 代码沙盒：启用 pgvector 扩展 + 创建 sandbox_submissions 表

-- 1. 启用 pgvector 扩展（功能4 RAG 也需要）
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. 沙盒执行记录表（通用代码执行，不依赖 practice_problems）
CREATE TABLE IF NOT EXISTS sandbox_submissions (
    id              BIGINT NOT NULL,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id       BIGINT REFERENCES lessons(id) ON DELETE SET NULL,
    language_id     INTEGER NOT NULL,          -- Judge0 language_id (71=Python, 63=JS, 54=C++)
    source_code     TEXT NOT NULL,
    stdin           TEXT,
    expected_output TEXT,
    actual_output   TEXT,
    status          VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    -- Judge0 status: Accepted, Wrong Answer, Time Limit Exceeded,
    --                Compilation Error, Runtime Error, Internal Error
    time_ms         NUMERIC(10,3),             -- 执行时间（毫秒）
    memory_kb       INTEGER,                   -- 内存占用（KB）
    token           VARCHAR(64),               -- Judge0 submission token
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_sandbox_user ON sandbox_submissions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sandbox_lesson ON sandbox_submissions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_sandbox_token ON sandbox_submissions(token);
