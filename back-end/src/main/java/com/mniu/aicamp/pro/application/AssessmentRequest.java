package com.mniu.aicamp.pro.application;

import jakarta.validation.constraints.NotEmpty;

import java.util.Map;

/**
 * 能力诊断提交请求
 */
public record AssessmentRequest(
        @NotEmpty(message = "答案不能为空") Map<Integer, Integer> answers
) {
}
