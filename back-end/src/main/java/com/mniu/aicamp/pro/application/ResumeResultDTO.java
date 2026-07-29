package com.mniu.aicamp.pro.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;
import java.util.List;

/**
 * 简历优化结果
 */
public record ResumeResultDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long id,
        int atsScoreBefore,
        int atsScoreAfter,
        List<String> keywords,
        List<ResumeSuggestionDTO> suggestions,
        Instant createdAt
) {
    public record ResumeSuggestionDTO(
            String type,
            String level,
            String before,
            String after
    ) {
    }
}
