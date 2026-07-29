package com.mniu.aicamp.quiz.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;

public record Exam(@JsonSerialize(using = ToStringSerializer.class) Long id,
                   Long roadmapId,
                   int week,
                   String title,
                   String description,
                   int questionCount,
                   int timeLimitMinutes,
                   int passingScore,
                   Instant createdAt) {
}
