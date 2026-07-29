package com.mniu.aicamp.course.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.util.List;

public record CourseProgress(@JsonSerialize(using = ToStringSerializer.class) Long courseId,
                             int totalLessons,
                             int completedLessons,
                             int completionPercent,
                             List<LessonProgress> lessons) {
}
