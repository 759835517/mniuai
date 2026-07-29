package com.mniu.aicamp.campus.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/**
 * 路径内的课程摘要
 */
public record CourseSummaryDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long id,
        String title,
        String description,
        String category,
        String difficulty,
        Integer totalLessons,
        Integer totalMinutes,
        Integer sortOrder,
        Boolean required
) {
}
