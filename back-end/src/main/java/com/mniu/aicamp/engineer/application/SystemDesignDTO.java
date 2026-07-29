package com.mniu.aicamp.engineer.application;

import java.util.List;

/**
 * 系统设计题DTO
 */
public record SystemDesignDTO(
        String id,
        String name,
        String difficulty,
        List<String> tags,
        String description,
        List<String> steps,
        boolean completed
) {
}
