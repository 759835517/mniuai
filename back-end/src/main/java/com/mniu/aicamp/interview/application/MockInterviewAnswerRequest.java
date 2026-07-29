package com.mniu.aicamp.interview.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MockInterviewAnswerRequest(@NotNull Long questionId,
                                         @NotBlank String userAnswer,
                                         Integer thinkingSeconds) {
}
