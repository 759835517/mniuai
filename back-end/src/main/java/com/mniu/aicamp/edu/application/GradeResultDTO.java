package com.mniu.aicamp.edu.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;
import java.util.List;

/**
 * 批改结果 DTO
 */
public record GradeResultDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long id,
        String subject,
        int totalScore,
        List<GradeItemDTO> items,
        Instant createdAt
) {
    public record GradeItemDTO(
            int questionNumber,
            int score,
            int maxScore,
            String comment,
            double confidence
    ) {}
}
