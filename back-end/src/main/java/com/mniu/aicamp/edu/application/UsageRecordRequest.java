package com.mniu.aicamp.edu.application;

import jakarta.validation.constraints.NotBlank;

/**
 * 使用记录请求
 */
public record UsageRecordRequest(
        @NotBlank(message = "工具类型不能为空") String toolType,
        String action,
        Integer duration
) {}
