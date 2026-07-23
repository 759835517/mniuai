package com.mniu.aicamp.roadmap.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;
import java.util.List;

public record RoadmapProgress(@JsonSerialize(using = ToStringSerializer.class) Long roadmapId,
                              int totalTasks,
                              int completedTasks,
                              int completionPercent,
                              List<RoadmapProgressItem> items) {
    public record RoadmapProgressItem(int weekNumber, int taskIndex, String status, Instant completedAt) {
    }
}
