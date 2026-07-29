package com.mniu.aicamp.engineer.application;

import java.util.List;

/**
 * 学习路径DTO
 */
public record PathDTO(
        String id,
        String name,
        String duration,
        String level,
        String icon,
        String desc,
        List<String> modules,
        boolean popular
) {
}
