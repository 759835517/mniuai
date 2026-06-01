package com.mniu.aicamp.notification.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;

public record Notification(@JsonSerialize(using = ToStringSerializer.class) Long id,
                           String type,
                           String message,
                           boolean read,
                           Instant createdAt) {
}
