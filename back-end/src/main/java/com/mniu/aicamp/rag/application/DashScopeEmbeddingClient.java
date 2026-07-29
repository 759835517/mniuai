package com.mniu.aicamp.rag.application;

import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * DashScope text-embedding-v3 实现。
 * 生成 1536 维 embedding 向量。
 */
@Component
@ConditionalOnProperty(name = "app.ai.provider", havingValue = "dashscope", matchIfMissing = true)
public class DashScopeEmbeddingClient implements EmbeddingPort {

    private static final String EMBEDDING_MODEL = "text-embedding-v3";
    private static final int DIMENSIONS = 1536;

    private final RestClient restClient;
    private final String apiKey;

    public DashScopeEmbeddingClient(
            RestClient.Builder builder,
            @Value("${spring.ai.dashscope.api-key:}") String apiKey,
            @Value("${app.ai.dashscope.base-url:https://dashscope.aliyuncs.com/compatible-mode/v1}") String baseUrl) {
        this.restClient = builder.baseUrl(baseUrl).build();
        this.apiKey = apiKey;
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<Double> embed(String text) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new BusinessException(ErrorCode.EMBEDDING_ERROR, "DashScope API key not configured");
        }
        Map<String, Object> body = Map.of(
                "model", EMBEDDING_MODEL,
                "input", Map.of("texts", List.of(text))
        );
        try {
            Map<String, Object> response = restClient.post()
                    .uri("/embeddings")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);
            if (response == null) {
                throw new BusinessException(ErrorCode.EMBEDDING_ERROR, "Empty embedding response");
            }
            Map<String, Object> output = (Map<String, Object>) response.get("output");
            if (output == null) {
                throw new BusinessException(ErrorCode.EMBEDDING_ERROR, "Missing output in embedding response");
            }
            List<Map<String, Object>> embeddings = (List<Map<String, Object>>) output.get("embeddings");
            if (embeddings == null || embeddings.isEmpty()) {
                throw new BusinessException(ErrorCode.EMBEDDING_ERROR, "No embeddings returned");
            }
            Map<String, Object> first = embeddings.get(0);
            Object embedding = first.get("embedding");
            if (embedding instanceof List<?> list) {
                return list.stream()
                        .map(v -> v instanceof Number n ? n.doubleValue() : Double.parseDouble(v.toString()))
                        .toList();
            }
            throw new BusinessException(ErrorCode.EMBEDDING_ERROR, "Invalid embedding format");
        } catch (BusinessException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BusinessException(ErrorCode.EMBEDDING_ERROR, "Embedding failed: " + ex.getMessage());
        }
    }

    @Override
    public int dimension() {
        return DIMENSIONS;
    }
}
