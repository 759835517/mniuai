package com.mniu.aicamp.roadmap.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

public record RoadmapProgress(@JsonSerialize(using = ToStringSerializer.class) Long roadmapId,
                              int totalTasks,
                              int completedTasks,
                              int completionPercent) {
}
