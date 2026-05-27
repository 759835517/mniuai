package com.mniu.aicamp.shared.ai;

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

@Component
@ConditionalOnProperty(name = "app.ai.provider", havingValue = "dashscope", matchIfMissing = true)
public class DashScopeAiClient implements AiClientPort {
    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    public DashScopeAiClient(
            RestClient.Builder builder,
            @Value("${spring.ai.dashscope.api-key:}") String apiKey,
            @Value("${app.ai.default-model:qwen-plus}") String model,
            @Value("${app.ai.dashscope.base-url:https://dashscope.aliyuncs.com/compatible-mode/v1}") String baseUrl) {
        this.restClient = builder.baseUrl(baseUrl).build();
        this.apiKey = apiKey;
        this.model = model;
    }

    @Override
    @SuppressWarnings("unchecked")
    public String chat(String systemPrompt, String userPrompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new BusinessException(ErrorCode.AI_PROVIDER_ERROR, "DashScope API key is not configured");
        }
        Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt == null ? "" : systemPrompt),
                        Map.of("role", "user", "content", userPrompt == null ? "" : userPrompt)
                )
        );
        try {
            Map<String, Object> response = restClient.post()
                    .uri("/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices == null || choices.isEmpty()) {
                throw new BusinessException(ErrorCode.AI_PROVIDER_ERROR, "DashScope returned no choices");
            }
            Map<String, Object> message = (Map<String, Object>) choices.getFirst().get("message");
            Object content = message == null ? null : message.get("content");
            if (content == null || content.toString().isBlank()) {
                throw new BusinessException(ErrorCode.AI_PROVIDER_ERROR, "DashScope returned empty content");
            }
            return content.toString();
        } catch (BusinessException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BusinessException(ErrorCode.AI_PROVIDER_ERROR, "DashScope request failed: " + ex.getMessage());
        }
    }
}
