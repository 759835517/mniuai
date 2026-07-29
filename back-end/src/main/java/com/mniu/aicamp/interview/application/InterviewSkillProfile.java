package com.mniu.aicamp.interview.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;

public record InterviewSkillProfile(@JsonSerialize(using = ToStringSerializer.class) Long id,
                                    Long userId,
                                    String category,
                                    double avgScore,
                                    int interviewCount,
                                    Instant lastUpdated) {
}
