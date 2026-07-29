package com.mniu.aicamp.course.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LessonCreateRequest(@NotBlank @Size(max = 200) String title,
                                  String description,
                                  String videoUrl,
                                  String hlsManifestUrl,
                                  int videoDuration,
                                  String thumbnailUrl,
                                  int sortOrder,
                                  boolean free,
                                  boolean requiresExamPass) {
}
