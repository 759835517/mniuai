package com.mniu.aicamp.interview.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;
import java.util.List;

public record InterviewSet(@JsonSerialize(using = ToStringSerializer.class) Long id,
                           String title,
                           String description,
                           String targetRole,
                           String difficulty,
                           List<Long> questionIds,
                           int durationMinutes,
                           String status,
                           Instant createdAt) {
}
