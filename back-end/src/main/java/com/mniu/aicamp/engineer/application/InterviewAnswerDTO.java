package com.mniu.aicamp.engineer.application;

/**
 * AI面试回答DTO
 */
public record InterviewAnswerDTO(
        String sessionId,
        String reply,
        String followUp,
        boolean finished
) {
}
