package com.mniu.aicamp.sandbox.application;

import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.Map;

/**
 * Judge0 API 客户端（自托管）。
 * 文档: https://ce.judge0.com/
 *
 * 使用 base64 编码传输，同步等待结果（wait=true 或 polling）。
 */
@Component
public class Judge0Client {

    private final RestClient restClient;
    private final Duration timeout;

    public Judge0Client(
            RestClient.Builder builder,
            @Value("${app.judge0.base-url:http://localhost:2358}") String baseUrl,
            @Value("${app.judge0.auth-token:}") String authToken,
            @Value("${app.judge0.timeout:30s}") Duration timeout) {
        this.timeout = timeout;
        RestClient.Builder b = builder.baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        if (authToken != null && !authToken.isBlank()) {
            b = b.defaultHeader("X-Auth-Token", authToken);
        }
        this.restClient = b.build();
    }

    /**
     * 提交代码并同步等待结果。
     * 使用 wait=true 让 Judge0 在服务端等待执行完成（最多 timeout 秒）。
     */
    public SubmitResult submitAndWait(int languageId, String sourceCode,
                                      String stdin, String expectedOutput,
                                      int timeLimitSec, int memoryLimitMb) {
        Map<String, Object> body = Map.of(
                "source_code", java.util.Base64.getEncoder().encodeToString(sourceCode.getBytes()),
                "language_id", languageId,
                "stdin", encodeBase64(stdin),
                "expected_output", encodeBase64(expectedOutput),
                "base64_encoded_inputs", "1",
                "base64_encoded_outputs", "1",
                "cpu_time_limit", timeLimitSec,
                "memory_limit", memoryLimitMb * 1024,
                "wait", true
        );

        try {
            SubmitResponse response = restClient.post()
                    .uri("/submissions?wait=true")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(SubmitResponse.class);

            if (response == null) {
                throw new BusinessException(ErrorCode.CODE_EXECUTION_ERROR, "Judge0 returned null response");
            }

            return new SubmitResult(
                    response.token(),
                    response.status() != null ? response.status().description() : "Unknown",
                    decodeBase64(response.stdout()),
                    decodeBase64(response.stderr()),
                    response.time(),
                    response.memory()
            );
        } catch (BusinessException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BusinessException(ErrorCode.CODE_EXECUTION_ERROR,
                    "Judge0 request failed: " + ex.getMessage());
        }
    }

    private String encodeBase64(String value) {
        if (value == null || value.isBlank()) return "";
        return java.util.Base64.getEncoder().encodeToString(value.getBytes());
    }

    private String decodeBase64(String value) {
        if (value == null || value.isBlank()) return "";
        try {
            return new String(java.util.Base64.getDecoder().decode(value));
        } catch (Exception e) {
            return value;
        }
    }

    /** Judge0 提交响应 */
    public record SubmitResponse(
            String token,
            Status status,
            String stdout,
            String stderr,
            Double time,
            Integer memory
    ) {
        public record Status(Integer id, String description) {}
    }

    /** 解析后的提交结果 */
    public record SubmitResult(
            String token,
            String statusDescription,
            String stdout,
            String stderr,
            Double timeSec,
            Integer memoryKb
    ) {}
}
