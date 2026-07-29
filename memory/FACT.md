# RAG 知识库实施进度（2026-07-28）

## 已完成
- V18__rag_pgvector.sql 迁移
- EmbeddingPort 接口 + DashScopeEmbeddingClient + FakeEmbeddingClient
- TextChunker（500字符+50重叠）
- VectorTypeHandler（pgvector 类型映射）
- DocumentChunkPO + DocumentChunkMapper（含余弦相似度查询）
- RagService（search + buildRagContext）
- DocumentChunkService（indexLesson + indexAllPublishedLessons）

## 进行中
- RagController（admin 端点）
- CoachService 改造（注入 RagService）

## 待完成
- 单元测试：TextChunkerTest、FakeEmbeddingClientTest、RagServiceTest
- 编译验证 + 全部测试运行
- E2E 测试
- 产品验收

## 架构决策
- CoachService 通过 buildCoachPrompt 注入 RAG context（lessonId 可为 null 表示全库检索）
- RagController 使用 /api/v1/admin/rag 路径（与 AdminCourseController 一致）
- app.rag.enabled 配置控制是否启用 RAG 注入
