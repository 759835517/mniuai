package com.mniu.aicamp.edu.application;

import jakarta.validation.constraints.NotBlank;

/**
 * 教案生成请求
 */
public record LessonRequest(
        @NotBlank(message = "学科不能为空") String subject,
        @NotBlank(message = "年级不能为空") String grade,
        @NotBlank(message = "课题不能为空") String topic,
        String duration,
        String objective,
        String textbook
) {}
