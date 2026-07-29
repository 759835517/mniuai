package com.mniu.aicamp.engineer.application;

/**
 * 学习路径查询请求（预留筛选参数）
 */
public record PathsRequest(
        String level,
        String goal
) {
}
