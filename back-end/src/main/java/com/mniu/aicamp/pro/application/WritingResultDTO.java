package com.mniu.aicamp.pro.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;

/**
 * 文档生成结果
 */
public record WritingResultDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long id,
        String docType,
        String title,
        String content,
        Instant createdAt
) {
}
