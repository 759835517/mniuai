package com.mniu.aicamp.pro.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;

/**
 * 数据分析结果
 */
public record DataAnalysisResultDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long id,
        String query,
        String insight,
        String chartType,
        Instant createdAt
) {
}
