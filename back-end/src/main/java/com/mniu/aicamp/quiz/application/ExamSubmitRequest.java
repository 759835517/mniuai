package com.mniu.aicamp.quiz.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ExamSubmitRequest(@NotNull Long recordId,
                                @NotBlank List<AnswerItem> answers) {
}

record AnswerItem(@NotNull Long questionId,
                  Object userAnswer) {
}
