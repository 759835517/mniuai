package com.mniu.aicamp.engineer.application;

/**
 * AI提示结果
 */
public record HintResultDTO(
        int level,
        String label,
        String content
) {
}
