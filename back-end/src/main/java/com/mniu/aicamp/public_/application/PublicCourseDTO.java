package com.mniu.aicamp.public_.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/**
 * 官网公开课程 DTO（无需登录）
 */
public record PublicCourseDTO(@JsonSerialize(using = ToStringSerializer.class) Long id,
                               String title,
                               String description,
                               String coverUrl,
                               String category,
                               String difficulty,
                               String targetAudience,
                               int totalLessons,
                               int totalMinutes) {
}
