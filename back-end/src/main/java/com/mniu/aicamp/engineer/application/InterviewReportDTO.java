package com.mniu.aicamp.engineer.application;

import java.time.Instant;
import java.util.List;

/**
 * AI面试报告DTO
 */
public record InterviewReportDTO(
        String sessionId,
        int totalScore,
        List<DimensionScore> dimensions,
        List<WeakPoint> weakPoints,
        String recommendation,
        int percentile,
        Instant createdAt
) {
    public record DimensionScore(String name, int score, String weight) {
    }

    public record WeakPoint(String topic, String detail) {
    }
}
