package com.mniu.aicamp.review.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;
import java.util.List;

public record CodeReview(@JsonSerialize(using = ToStringSerializer.class) Long id,
                         @JsonSerialize(using = ToStringSerializer.class) Long userId,
                         String language, int score, List<String> suggestions, Instant createdAt) {
}
