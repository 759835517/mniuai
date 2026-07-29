package com.mniu.aicamp.engineer.application;

import java.time.Instant;
import java.util.List;

/**
 * 代码审查结果DTO
 */
public record CodeReviewResultDTO(
        Long id,
        int totalScore,
        List<Issue> criticalIssues,
        List<Issue> improvements,
        List<String> goodPoints,
        Instant createdAt
) {
    public record Issue(String dimension, String level, String before, String after) {
    }
}
