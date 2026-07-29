package com.mniu.aicamp.campus.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/**
 * 学习路径 DTO（公开接口返回）
 */
public record LearningPathDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long id,
        String slug,
        String name,
        String description,
        String icon,
        Integer durationWeeks,
        String levelFrom,
        String levelTo,
        Integer sortOrder
) {
}
