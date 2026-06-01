package com.mniu.aicamp.project.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

public record ProjectTask(@JsonSerialize(using = ToStringSerializer.class) Long id,
                          String title,
                          boolean completed) {
}
