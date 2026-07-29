package com.mniu.aicamp.engineer.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * 提交面试回答请求
 */
public record InterviewAnswerRequest(
        @NotNull(message = "会话ID不能为空")
        String sessionId,

        @NotBlank(message = "回答不能为空")
        String answer
) {
}
