package com.mniu.aicamp.engineer.application;

import jakarta.validation.constraints.NotBlank;

/**
 * 代码审查请求
 */
public record CodeReviewRequest(
        @NotBlank(message = "代码不能为空")
        String code,

        String language
) {
}
