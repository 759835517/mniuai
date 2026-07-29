package com.mniu.aicamp.engineer.application;

import java.time.Instant;
import java.util.Map;

/**
 * 能力诊断测评结果
 */
public record AssessmentResultDTO(
        Long id,
        Map<String, Integer> dimensionScores,
        int totalScore,
        String level,
        String weakPoints,
        String recommendation,
        Instant createdAt
) {
}
