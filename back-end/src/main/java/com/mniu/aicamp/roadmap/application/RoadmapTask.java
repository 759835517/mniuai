package com.mniu.aicamp.roadmap.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

public record RoadmapTask(@JsonSerialize(using = ToStringSerializer.class) Long id,
                          int week,
                          String title,
                          boolean completed) {
}
