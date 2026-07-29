-- V19: 程序员端学习进度追踪
-- 1. engineer_progress 程序员学习进度（对赌条件）
CREATE TABLE IF NOT EXISTS engineer_progress (
    id                      BIGINT NOT NULL,
    user_id                 BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    solved_problems         INTEGER NOT NULL DEFAULT 0,
    completed_tasks         INTEGER NOT NULL DEFAULT 0,
    interview_rounds        INTEGER NOT NULL DEFAULT 0,
    system_design_count     INTEGER NOT NULL DEFAULT 0,
    code_review_count       INTEGER NOT NULL DEFAULT 0,
    job_applications        INTEGER NOT NULL DEFAULT 0,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    UNIQUE (user_id)
);
CREATE INDEX IF NOT EXISTS idx_engineer_progress_user ON engineer_progress(user_id);

-- 2. engineer_activity_log 学习行为日志（可选，用于审计）
CREATE TABLE IF NOT EXISTS engineer_activity_log (
    id              BIGINT NOT NULL,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type   VARCHAR(40) NOT NULL,  -- ALGORITHM_SOLVE / TASK_COMPLETE / INTERVIEW / SYSTEM_DESIGN / CODE_REVIEW / JOB_APPLY
    ref_id          VARCHAR(80),           -- 关联的题目/任务ID
    score           INTEGER,               -- 得分（可选）
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_engineer_activity_user ON engineer_activity_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_engineer_activity_type ON engineer_activity_log(activity_type);
