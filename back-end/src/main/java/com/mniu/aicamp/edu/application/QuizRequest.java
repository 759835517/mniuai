package com.mniu.aicamp.edu.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * 出题请求
 */
public record QuizRequest(
        @NotBlank(message = "学科不能为空") String subject,
        @NotBlank(message = "年级不能为空") String grade,
        String knowledgePoint,
        @NotNull(message = "题型不能为空") List<String> questionTypes,
        String difficulty,
        @NotNull(message = "题目数量不能为空") Integer count,
        Boolean withAnswer
) {}
