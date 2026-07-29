package com.mniu.aicamp.interview.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;
import java.util.Map;

public record MockInterviewAnswer(@JsonSerialize(using = ToStringSerializer.class) Long id,
                                  Long mockInterviewId,
                                  Long questionId,
                                  int questionOrder,
                                  String userAnswer,
                                  Integer aiScore,
                                  String aiFeedback,
                                  Map<String, Boolean> aiKeyPointsHit,
                                  Integer thinkingSeconds,
                                  Instant answeredAt) {
}
