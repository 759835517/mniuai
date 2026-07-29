package com.mniu.aicamp.engineer.application;

import java.util.List;

/**
 * 程序员端对赌进度DTO
 */
public record EngineerGuaranteeDTO(
        int solvedProblems,
        int requiredProblems,
        int completedTasks,
        int requiredTasks,
        int interviewRounds,
        int requiredInterviews,
        int systemDesignCount,
        int requiredSystemDesign,
        int codeReviewCount,
        int requiredCodeReview,
        int jobApplications,
        int requiredApplications,
        int completionPct,
        boolean qualified,
        List<String> gaps
) {
}
