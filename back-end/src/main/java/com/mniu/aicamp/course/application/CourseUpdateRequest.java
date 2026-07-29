package com.mniu.aicamp.course.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CourseUpdateRequest(@NotBlank @Size(max = 200) String title,
                                  String description,
                                  String coverUrl,
                                  String category,
                                  String difficulty,
                                  String targetAudience,
                                  int totalLessons,
                                  int totalMinutes,
                                  int sortOrder) {
}
