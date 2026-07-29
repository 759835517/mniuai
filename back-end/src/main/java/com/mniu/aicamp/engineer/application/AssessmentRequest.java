package com.mniu.aicamp.engineer.application;

import jakarta.validation.constraints.NotNull;

import java.util.Map;

/**
 * 能力诊断测评请求
 */
public record AssessmentRequest(
        @NotNull(message = "答案不能为空")
        Map<Integer, Integer> answers
) {
}
