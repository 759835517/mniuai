package com.mniu.aicamp.pro.application;

import jakarta.validation.constraints.NotBlank;

/**
 * 简历优化请求
 */
public record ResumeRequest(
        @NotBlank(message = "简历内容不能为空") String resume,
        String targetJd
) {
}
