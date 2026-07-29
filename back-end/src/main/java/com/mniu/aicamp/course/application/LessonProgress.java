package com.mniu.aicamp.course.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

public record LessonProgress(@JsonSerialize(using = ToStringSerializer.class) Long lessonId,
                             String title,
                             int lastPositionSec,
                             int validWatchedSec,
                             boolean completed) {
}
