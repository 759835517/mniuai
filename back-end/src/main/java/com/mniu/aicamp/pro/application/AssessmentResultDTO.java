package com.mniu.aicamp.pro.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;
import java.util.Map;

/**
 * 能力诊断结果
 */
public record AssessmentResultDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long id,
        Map<String, Integer> dimensionScores,
        int totalScore,
        String level,
        String recommendation,
        Instant createdAt
) {
}
