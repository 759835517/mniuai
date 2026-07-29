package com.mniu.aicamp.campus.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/**
 * 编程练习题目 DTO
 */
public record PracticeProblemDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long id,
        String slug,
        String title,
        String description,
        String difficulty,
        String category,
        String tags,
        String starterCode,
        Integer timeLimitSec,
        Integer memoryLimitMb
) {
}
