package com.mniu.aicamp.edu.application;

/**
 * 使用统计 DTO
 */
public record UsageStatsDTO(
        int totalUsage,
        int lessonCount,
        int quizCount,
        int gradeCount,
        int slidesCount,
        int streakDays,
        int guaranteeProgress
) {}
