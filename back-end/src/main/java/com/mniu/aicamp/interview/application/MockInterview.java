package com.mniu.aicamp.interview.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;

public record MockInterview(@JsonSerialize(using = ToStringSerializer.class) Long id,
                            Long userId,
                            Long interviewSetId,
                            String mode,
                            String status,
                            Integer overallScore,
                            String aiSummary,
                            Instant startedAt,
                            Instant completedAt,
                            Integer durationSeconds) {
}
