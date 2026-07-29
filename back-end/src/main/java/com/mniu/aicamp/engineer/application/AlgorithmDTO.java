package com.mniu.aicamp.engineer.application;

/**
 * 算法题DTO
 */
public record AlgorithmDTO(
        Long id,
        String title,
        String difficulty,
        String category,
        String acceptance,
        String description,
        boolean solved
) {
}
