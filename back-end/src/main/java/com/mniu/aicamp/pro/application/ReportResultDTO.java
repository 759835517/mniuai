package com.mniu.aicamp.pro.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;

/**
 * 汇报材料生成结果
 */
public record ReportResultDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long id,
        String reportType,
        String title,
        String content,
        Instant createdAt
) {
}
