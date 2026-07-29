package com.mniu.aicamp.pro.application;

import jakarta.validation.constraints.NotBlank;

/**
 * 数据分析查询请求
 */
public record DataAnalysisRequest(
        @NotBlank(message = "查询问题不能为空") String query,
        String fileId
) {
}
