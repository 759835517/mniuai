package com.mniu.aicamp.campus.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/**
 * 代码提交结果 DTO
 */
public record CodeSubmissionDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long id,
        @JsonSerialize(using = ToStringSerializer.class) Long problemId,
        String language,
        String status,
        Integer passedCount,
        Integer totalCount,
        Integer runtimeMs,
        Integer memoryKb
) {
}
