package com.mniu.aicamp.engineer.application;

import java.time.Instant;

/**
 * 编程实战任务提交结果
 */
public record TaskSubmitResultDTO(
        Long id,
        String taskId,
        int passed,
        int total,
        int score,
        String feedback,
        Instant createdAt
) {
}
