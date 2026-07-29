package com.mniu.aicamp.interview.application;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record MockInterviewStartRequest(@NotBlank String mode,
                                        Long interviewSetId,
                                        String targetRole,
                                        List<String> categories,
                                        String difficulty,
                                        Integer questionCount) {
}
