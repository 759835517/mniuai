-- V18__rag_pgvector.sql
-- RAG 知识库：文档分块表 + pgvector HNSW 索引
-- 注意：pgvector 扩展已在 V17 创建

-- 文档分块表（存储课程知识库 chunk + embedding）
CREATE TABLE IF NOT EXISTS document_chunks (
    id              BIGINT NOT NULL,
    course_id       BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id       BIGINT REFERENCES lessons(id) ON DELETE SET NULL,
    chunk_index     INTEGER NOT NULL,
    content         TEXT NOT NULL,
    embedding       vector(1536) NOT NULL,  -- DashScope text-embedding-v3 维度
    metadata        JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    UNIQUE (lesson_id, chunk_index)
);
CREATE INDEX IF NOT EXISTS idx_chunks_lesson ON document_chunks(lesson_id);
CREATE INDEX IF NOT EXISTS idx_chunks_course ON document_chunks(course_id);
-- HNSW 索引（余弦相似度，pgvector 推荐）
CREATE INDEX IF NOT EXISTS idx_chunks_embedding_hnsw
    ON document_chunks USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);
