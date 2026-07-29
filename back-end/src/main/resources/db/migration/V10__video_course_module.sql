-- V10: Video course module + admin role
-- 1. users 加角色列
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'USER';
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. courses 课程表
CREATE TABLE IF NOT EXISTS courses (
    id              BIGINT NOT NULL,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    cover_url       TEXT,
    category        VARCHAR(60),
    difficulty      VARCHAR(20),
    target_audience VARCHAR(200),
    total_lessons   INTEGER NOT NULL DEFAULT 0,
    total_minutes   INTEGER NOT NULL DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

-- 3. lessons 章节表
CREATE TABLE IF NOT EXISTS lessons (
    id                  BIGINT NOT NULL,
    course_id           BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title               VARCHAR(200) NOT NULL,
    description         TEXT,
    video_url           TEXT,
    video_duration      INTEGER NOT NULL DEFAULT 0,
    thumbnail_url       TEXT,
    sort_order          INTEGER NOT NULL DEFAULT 0,
    is_free             BOOLEAN NOT NULL DEFAULT FALSE,
    requires_exam_pass  BOOLEAN NOT NULL DEFAULT FALSE,
    status              VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id, sort_order);

-- 4. course_enrollments 用户报名
CREATE TABLE IF NOT EXISTS course_enrollments (
    id              BIGINT NOT NULL,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id       BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at    TIMESTAMPTZ,
    PRIMARY KEY (id),
    UNIQUE (user_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON course_enrollments(user_id);

-- 5. video_progress 播放进度
CREATE TABLE IF NOT EXISTS video_progress (
    id                  BIGINT NOT NULL,
    user_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id           BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    last_position_sec   INTEGER NOT NULL DEFAULT 0,
    valid_watched_sec   INTEGER NOT NULL DEFAULT 0,
    total_duration_sec  INTEGER NOT NULL DEFAULT 0,
    watch_ratio         NUMERIC(5,4) NOT NULL DEFAULT 0,
    completed           BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    UNIQUE (user_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS idx_vprogress_user ON video_progress(user_id);

-- 6. video_heartbeats 心跳日志（RANGE 分区）
CREATE TABLE IF NOT EXISTS video_heartbeats (
    id              BIGINT NOT NULL,
    user_id         BIGINT NOT NULL,
    lesson_id       BIGINT NOT NULL,
    position_sec    INTEGER NOT NULL,
    speed           NUMERIC(3,2) NOT NULL DEFAULT 1.0,
    recorded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (recorded_at, id)
) PARTITION BY RANGE (recorded_at);

-- 预建 3 个月分区
CREATE TABLE IF NOT EXISTS video_heartbeats_2026_07 PARTITION OF video_heartbeats
    FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE IF NOT EXISTS video_heartbeats_2026_08 PARTITION OF video_heartbeats
    FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
CREATE TABLE IF NOT EXISTS video_heartbeats_2026_09 PARTITION OF video_heartbeats
    FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
