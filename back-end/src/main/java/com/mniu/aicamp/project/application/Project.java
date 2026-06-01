package com.mniu.aicamp.project.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.mniu.aicamp.project.domain.ProjectStatus;

import java.util.List;

public record Project(@JsonSerialize(using = ToStringSerializer.class) Long id,
                      @JsonSerialize(using = ToStringSerializer.class) Long userId,
                      String name,
                      String type,
                      ProjectStatus status,
                      List<ProjectTask> tasks) {
}
