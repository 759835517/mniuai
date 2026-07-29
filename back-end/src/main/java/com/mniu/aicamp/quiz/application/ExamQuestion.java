package com.mniu.aicamp.quiz.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.util.List;

public record ExamQuestion(@JsonSerialize(using = ToStringSerializer.class) Long id,
                           Long examId,
                           String questionType,
                           int orderNum,
                           String content,
                           List<QuestionOption> options,
                           String explanation,
                           int xpReward) {
}

record QuestionOption(String key, String content) {
}
