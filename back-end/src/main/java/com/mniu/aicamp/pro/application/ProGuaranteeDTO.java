package com.mniu.aicamp.pro.application;

import java.util.List;

/**
 * 对赌进度 DTO
 */
public record ProGuaranteeDTO(
        int usageCount,
        int requiredUsage,
        int completedTasks,
        int requiredTasks,
        int activeDays,
        int requiredDays,
        boolean qualified,
        List<String> gaps
) {
}
