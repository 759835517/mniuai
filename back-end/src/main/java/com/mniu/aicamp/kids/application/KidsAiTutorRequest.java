package com.mniu.aicamp.kids.application;

import jakarta.validation.constraints.NotBlank;

/**
 * 少儿 AI 助教对话请求
 *
 * @param message  用户消息
 * @param sessionId 会话 ID（首次对话可为空）
 * @param lessonId 关联课时 ID（可为空）
 * @param code     当前代码（可选，用于代码辅导场景）
 */
public record KidsAiTutorRequest(
        @NotBlank(message = "消息不能为空") String message,
        Long sessionId,
        Long lessonId,
        String code
) {
}
