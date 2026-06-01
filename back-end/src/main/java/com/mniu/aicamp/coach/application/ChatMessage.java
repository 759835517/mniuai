package com.mniu.aicamp.coach.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;

public record ChatMessage(@JsonSerialize(using = ToStringSerializer.class) Long id,
                          String role,
                          String content,
                          Instant createdAt) {
}
