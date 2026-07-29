package com.mniu.aicamp.pro.application;

import jakarta.validation.constraints.NotBlank;

/**
 * 工具使用评分请求
 */
public record FeedbackRequest(
        @NotBlank(message = "工具类型不能为空") String toolType,
        int rating,
        String reason
) {
}
