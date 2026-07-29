package com.mniu.aicamp.interview.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record InterviewQuestionCreateRequest(@NotBlank String category,
                                             String subCategory,
                                             @NotBlank String difficulty,
                                             @NotBlank String title,
                                             @NotBlank String content,
                                             String expectedAnswer,
                                             @NotNull List<String> keyPoints,
                                             @NotNull List<String> companies,
                                             @NotNull List<String> tags,
                                             String source) {
}
