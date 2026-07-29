-- Flyway: V13__quiz_exam.sql
-- Quiz & Exam Module: exams, exam_questions, exam_records

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
ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS mastery_score int DEFAULT NULL;
ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS mastery_level varchar(20) DEFAULT 'NOT_TESTED';
ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS last_exam_at timestamp DEFAULT NULL;
