package com.mniu.aicamp.engineer.application;

/**
 * AI编程实战任务DTO
 */
public record TaskDTO(
        String id,
        String title,
        String type,
        String difficulty,
        String lang,
        String duration,
        String desc
) {
}
