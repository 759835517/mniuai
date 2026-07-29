package com.mniu.aicamp.interview.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;
import java.util.List;

public record MockInterviewDetail(@JsonSerialize(using = ToStringSerializer.class) Long id,
                                  Long userId,
                                  Long interviewSetId,
                                  String mode,
                                  String status,
                                  Integer overallScore,
                                  String aiSummary,
                                  Instant startedAt,
                                  Instant completedAt,
                                  Integer durationSeconds,
                                  List<InterviewQuestion> questions) {
}
