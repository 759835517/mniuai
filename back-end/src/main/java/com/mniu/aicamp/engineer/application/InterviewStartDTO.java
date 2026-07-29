package com.mniu.aicamp.engineer.application;

/**
 * AI面试开始DTO
 */
public record InterviewStartDTO(
        String sessionId,
        String opening,
        String firstQuestion
) {
}
