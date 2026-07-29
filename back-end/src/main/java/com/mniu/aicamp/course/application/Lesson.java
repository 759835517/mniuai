package com.mniu.aicamp.course.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

public record Lesson(@JsonSerialize(using = ToStringSerializer.class) Long id,
                     Long courseId,
                     String title,
                     String description,
                     String videoUrl,
                     int videoDuration,
                     String thumbnailUrl,
                     int sortOrder,
                     boolean free,
                     boolean requiresExamPass,
                     String status) {
}
