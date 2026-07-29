package com.mniu.aicamp.campus.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * 代码提交请求
 */
public record CodeSubmitRequest(
        @NotNull Long problemId,
        @NotBlank String language,
        @NotBlank String sourceCode
) {
}
