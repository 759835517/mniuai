package com.mniu.aicamp.edu.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;
import java.util.List;

/**
 * 课件 DTO
 */
public record SlidesDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long id,
        String subject,
        String grade,
        String topic,
        List<SlideItemDTO> slides,
        Instant createdAt
) {
    public record SlideItemDTO(
            int pageNumber,
            String title,
            String content,
            String notes
    ) {}
}
