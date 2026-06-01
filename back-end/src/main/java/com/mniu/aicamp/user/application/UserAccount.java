package com.mniu.aicamp.user.application;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.util.List;

public record UserAccount(@JsonSerialize(using = ToStringSerializer.class) Long id,
                          String email,
                          @JsonIgnore String passwordHash,
                          String displayName,
                          List<String> skills,
                          String goal,
                          int weeklyHours) {
}
