package com.mniu.aicamp.roadmap.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;
import java.util.List;

public record Roadmap(@JsonSerialize(using = ToStringSerializer.class) Long id,
                      @JsonSerialize(using = ToStringSerializer.class) Long userId,
                      String targetRole,
                      int weeklyHours,
                      boolean active,
                      List<RoadmapTask> tasks,
                      Instant createdAt) {
}
