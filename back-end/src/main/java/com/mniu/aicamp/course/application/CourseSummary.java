package com.mniu.aicamp.course.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

public record CourseSummary(@JsonSerialize(using = ToStringSerializer.class) Long id,
                            String title,
                            String coverUrl,
                            String category,
                            String difficulty,
                            int totalLessons,
                            int totalMinutes,
                            boolean enrolled,
                            double progressPercent) {
}
