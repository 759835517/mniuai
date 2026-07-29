package com.mniu.aicamp.edu.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.util.List;

/**
 * 题目 DTO
 */
public record QuizQuestionDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long id,
        String type,
        String content,
        List<String> options,
        String answer,
        String analysis,
        String difficulty,
        String knowledgePoint
) {}
