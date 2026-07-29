package com.mniu.aicamp.campus.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/**
 * 学习进度总览 DTO
 */
public record ProgressDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long pathId,
        String pathName,
        Double courseCompletionPct,
        Integer practiceCompleted,
        Integer practicePassed,
        Integer interviewRounds,
        Boolean resumeGenerated,
        Boolean enrolled
) {
}
