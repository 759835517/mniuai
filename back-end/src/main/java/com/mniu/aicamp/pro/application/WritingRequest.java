package com.mniu.aicamp.pro.application;

import jakarta.validation.constraints.NotBlank;

/**
 * 文档生成请求
 */
public record WritingRequest(
        @NotBlank(message = "文档类型不能为空") String docType,
        @NotBlank(message = "内容不能为空") String content,
        String template,
        String industry
) {
}
