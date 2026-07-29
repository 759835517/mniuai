package com.mniu.aicamp.quiz.application;

import jakarta.validation.constraints.NotNull;

public record ExamGenerateRequest(@NotNull Long roadmapId) {
}
