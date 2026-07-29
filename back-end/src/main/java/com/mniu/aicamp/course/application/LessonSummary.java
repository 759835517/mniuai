package com.mniu.aicamp.course.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

public record LessonSummary(@JsonSerialize(using = ToStringSerializer.class) Long id,
                            String title,
                            String thumbnailUrl,
                            int durationSec,
                            int sortOrder,
                            boolean free,
                            boolean unlocked,
                            boolean completed) {
}
