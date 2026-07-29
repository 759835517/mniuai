package com.mniu.aicamp.quiz.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record ExamRecord(@JsonSerialize(using = ToStringSerializer.class) Long id,
                         Long userId,
                         Long examId,
                         int score,
                         boolean passed,
                         int totalQuestions,
                         int correctCount,
                         List<AnswerDetail> answers,
                         AiEvaluation aiEvaluation,
                         Instant startedAt,
                         Instant completedAt) {
}

record AnswerDetail(Long questionId,
                    String questionType,
                    Object userAnswer,
                    Boolean isCorrect,
                    Integer pointsEarned) {
}

record AiEvaluation(List<ThinkingEvaluation> thinkingQuestions,
                    String overallComment) {
}

record ThinkingEvaluation(Long questionId,
                          int score,
                          int maxScore,
                          String feedback,
                          Map<String, Integer> dimensionScores) {
}
