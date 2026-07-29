package com.mniu.aicamp.kids.application;

/**
 * 少儿 AI 助教对话响应
 *
 * @param sessionId      会话 ID
 * @param reply          AI 回复内容
 * @param suggestedAction 建议操作
 */
public record KidsAiTutorResponse(
        Long sessionId,
        String reply,
        String suggestedAction
) {
}
