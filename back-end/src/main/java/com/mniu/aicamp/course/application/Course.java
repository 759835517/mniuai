package com.mniu.aicamp.course.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;

public record Course(@JsonSerialize(using = ToStringSerializer.class) Long id,
                     String title,
                     String description,
                     String coverUrl,
                     String category,
                     String difficulty,
                     String targetAudience,
                     int totalLessons,
                     int totalMinutes,
                     String status,
                     Instant createdAt) {
}
