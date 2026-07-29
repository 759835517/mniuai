package com.mniu.aicamp.course.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.util.List;

public record CourseDetail(@JsonSerialize(using = ToStringSerializer.class) Long id,
                           String title,
                           String description,
                           String coverUrl,
                           String category,
                           String difficulty,
                           String targetAudience,
                           int totalLessons,
                           int totalMinutes,
                           boolean enrolled,
                           List<LessonSummary> lessons) {
}
