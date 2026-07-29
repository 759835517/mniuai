package com.mniu.aicamp.engineer.application;

/**
 * AI提示请求
 * <p>
 * problemId 来自 URL 路径，无需客户端传递。
 */
public record HintRequest(
        String problemId,

        String code,

        int currentLevel
) {
}
