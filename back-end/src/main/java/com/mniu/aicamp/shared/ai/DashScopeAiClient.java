package com.mniu.aicamp.shared.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.http.HttpClient;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;

@Component
@ConditionalOnProperty(name = "app.ai.provider", havingValue = "dashscope", matchIfMissing = true)
public class DashScopeAiClient implements AiClientPort {
    private static final ObjectMapper JSON = new ObjectMapper();

    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    public DashScopeAiClient(
            RestClient.Builder builder,
            @Value("${spring.ai.dashscope.api-key:}") String apiKey,
            @Value("${app.ai.default-model:qwen-plus}") String model,
            @Value("${app.ai.dashscope.base-url:https://dashscope.aliyuncs.com/compatible-mode/v1}") String baseUrl,
            @Value("${app.ai.timeout:300s}") Duration timeout) {
        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(timeout)
                .build();
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(timeout);
        this.restClient = builder.baseUrl(baseUrl)
                .requestFactory(requestFactory)
                .build();
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

    @Override
    public void stream(String systemPrompt, String userPrompt, Consumer<String> onToken) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new BusinessException(ErrorCode.AI_PROVIDER_ERROR, "DashScope API key is not configured");
        }
        Map<String, Object> body = Map.of(
                "model", model,
                "stream", true,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt == null ? "" : systemPrompt),
                        Map.of("role", "user", "content", userPrompt == null ? "" : userPrompt)
                )
        );
        AtomicBoolean received = new AtomicBoolean(false);
        try {
            restClient.post()
                    .uri("/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.TEXT_EVENT_STREAM)
                    .body(body)
                    .exchange((request, response) -> {
                        if (!response.getStatusCode().is2xxSuccessful()) {
                            throw new BusinessException(ErrorCode.AI_PROVIDER_ERROR,
                                    "DashScope stream failed: HTTP " + response.getStatusCode().value());
                        }
                        try (BufferedReader reader = new BufferedReader(
                                new InputStreamReader(response.getBody(), StandardCharsets.UTF_8))) {
                            String line;
                            while ((line = reader.readLine()) != null) {
                                String data = sseData(line);
                                if (data == null || data.isBlank()) {
                                    continue;
                                }
                                if ("[DONE]".equals(data)) {
                                    break;
                                }
                                String delta = streamDelta(data);
                                if (delta != null && !delta.isEmpty()) {
                                    received.set(true);
                                    onToken.accept(delta);
                                }
                            }
                        }
                        return null;
                    });
        } catch (BusinessException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BusinessException(ErrorCode.AI_PROVIDER_ERROR, "DashScope stream failed: " + ex.getMessage());
        }
        if (!received.get()) {
            throw new BusinessException(ErrorCode.AI_PROVIDER_ERROR, "DashScope returned empty stream");
        }
    }

    private String sseData(String line) {
        if (!line.startsWith("data:")) {
            return null;
        }
        String data = line.substring(5);
        return data.startsWith(" ") ? data.substring(1) : data;
    }

    private String streamDelta(String data) {
        try {
            JsonNode root = JSON.readTree(data);
            JsonNode choices = root.path("choices");
            if (!choices.isArray() || choices.isEmpty()) {
                return null;
            }
            JsonNode choice = choices.get(0);
            JsonNode delta = choice.path("delta").path("content");
            if (!delta.isMissingNode() && !delta.isNull()) {
                return delta.asText();
            }
            JsonNode message = choice.path("message").path("content");
            return message.isMissingNode() || message.isNull() ? null : message.asText();
        } catch (Exception ex) {
            throw new BusinessException(ErrorCode.AI_PROVIDER_ERROR, "DashScope stream parse failed: " + ex.getMessage());
        }
    }
}
