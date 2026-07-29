package com.mniu.aicamp.edu.application;

import jakarta.validation.constraints.NotBlank;

/**
 * 批改请求
 */
public record GradeRequest(
        @NotBlank(message = "学科不能为空") String subject,
        @NotBlank(message = "题目不能为空") String question,
        @NotBlank(message = "学生答案不能为空") String studentAnswer,
        String standardAnswer
) {}
