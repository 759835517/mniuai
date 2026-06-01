package com.mniu.aicamp.coach.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;
import java.util.List;

public record CoachSession(@JsonSerialize(using = ToStringSerializer.class) Long id,
                           @JsonSerialize(using = ToStringSerializer.class) Long userId,
                           String title,
                           String contextType,
                           Instant createdAt,
                           Instant updatedAt,
                           List<ChatMessage> messages) {
}
