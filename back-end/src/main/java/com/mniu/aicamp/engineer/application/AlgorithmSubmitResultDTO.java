package com.mniu.aicamp.engineer.application;

import java.time.Instant;

/**
 * 算法题提交结果
 */
public record AlgorithmSubmitResultDTO(
        Long id,
        String problemId,
        boolean passed,
        int passedCases,
        int totalCases,
        String feedback,
        Instant createdAt
) {
}
