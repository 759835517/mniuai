-- V11: CMS articles + article_reads

-- 文章主表
CREATE TABLE IF NOT EXISTS articles (
    id              BIGINT NOT NULL,
    title           VARCHAR(300) NOT NULL,
    slug            VARCHAR(300) UNIQUE,
    summary         TEXT,
    content         TEXT NOT NULL,
    cover_url       TEXT,
    category        VARCHAR(50) NOT NULL,
    tags            JSONB NOT NULL DEFAULT '[]',
    author_id       BIGINT REFERENCES users(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    target_audience VARCHAR(20) NOT NULL DEFAULT 'ALL',
    difficulty      VARCHAR(20),
    read_minutes    INTEGER,
    view_count      BIGINT NOT NULL DEFAULT 0,
    like_count      BIGINT NOT NULL DEFAULT 0,
    associated_type VARCHAR(30),
    associated_id   BIGINT,
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_articles_status_category ON articles(status, category);
CREATE INDEX IF NOT EXISTS idx_articles_associated ON articles(associated_type, associated_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- 图文阅读进度
CREATE TABLE IF NOT EXISTS article_reads (
    id              BIGINT NOT NULL,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    article_id      BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    scroll_ratio    NUMERIC(5,4) NOT NULL DEFAULT 0,
    read_seconds    INTEGER NOT NULL DEFAULT 0,
    completed       BOOLEAN NOT NULL DEFAULT FALSE,
    first_read_at   TIMESTAMPTZ,
    last_read_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    UNIQUE (user_id, article_id)
);
CREATE INDEX IF NOT EXISTS idx_article_reads_user ON article_reads(user_id, article_id);
