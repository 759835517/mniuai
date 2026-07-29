package com.mniu.aicamp.rag.application;

import com.mniu.aicamp.rag.infrastructure.mapper.DocumentChunkMapper;
import com.mniu.aicamp.rag.infrastructure.mapper.DocumentChunkMapper.DocumentChunkResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RagService {

    private final DocumentChunkMapper chunkMapper;
    private final EmbeddingPort embeddingPort;
    private final int topK;
    private final double minSimilarity;

    public RagService(DocumentChunkMapper chunkMapper,
                      EmbeddingPort embeddingPort,
                      @Value("${app.rag.top-k:3}") int topK,
                      @Value("${app.rag.min-similarity:0.6}") double minSimilarity) {
        this.chunkMapper = chunkMapper;
        this.embeddingPort = embeddingPort;
        this.topK = topK;
        this.minSimilarity = minSimilarity;
    }

    /**
     * 语义检索：返回 topK 最相关 chunk。
     */
    public List<DocumentChunkResult> search(String query, Long lessonId) {
        if (query == null || query.isBlank()) {
            return List.of();
        }
        List<Double> queryEmbedding = embeddingPort.embed(query);
        String embeddingJson = toJsonArray(queryEmbedding);
        List<DocumentChunkResult> results = chunkMapper.searchSimilar(embeddingJson, lessonId, topK);
        if (results == null) {
            return List.of();
        }
        // 过滤低于最小相似度的结果
        return results.stream()
                .filter(r -> r.similarity() != null && r.similarity() >= minSimilarity)
                .toList();
    }

    /**
     * 构建 RAG context 字符串（注入 system prompt）。
     */
    public String buildRagContext(String query, Long lessonId) {
        List<DocumentChunkResult> chunks = search(query, lessonId);
        if (chunks.isEmpty()) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        sb.append("\n\n【课程知识库参考】\n");
        for (int i = 0; i < chunks.size(); i++) {
            DocumentChunkResult chunk = chunks.get(i);
            sb.append("--- 参考资料 ").append(i + 1).append(" ---\n");
            sb.append(chunk.content()).append("\n");
        }
        return sb.toString();
    }

    private String toJsonArray(List<Double> values) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < values.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(values.get(i));
        }
        sb.append("]");
        return sb.toString();
    }
}
