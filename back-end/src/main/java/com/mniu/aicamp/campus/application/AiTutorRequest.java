package com.mniu.aicamp.campus.application;

import jakarta.validation.constraints.NotBlank;

/**
 * AI 助教对话请求
 */
public record AiTutorRequest(
        @NotBlank(message = "消息内容不能为空")
        String message,
        // 可选：当前课程章节 ID，用于提供上下文
        Long lessonId,
        // 可选：当前代码内容
        String code,
        // 可选：对话历史（前端传入）
        java.util.List<HistoryMessage> history
) {
        public record HistoryMessage(String role, String content) {
        }
}
