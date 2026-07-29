package com.mniu.aicamp.campus.application;

/**
 * AI 助教对话响应
 */
public record AiTutorResponse(
        String reply,
        // 推荐的下一步行动
        String suggestedAction,
        // 相关知识点
        java.util.List<String> relatedTopics
) {
}
