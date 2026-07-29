package com.mniu.aicamp.edu.application;

import java.util.List;

/**
 * 对赌核查 DTO
 */
public record GuaranteeCheckDTO(
        int totalUsage,
        int requiredUsage,
        int daysUsed,
        int requiredDays,
        int toolsUsed,
        int requiredTools,
        boolean qualified,
        List<String> gaps
) {}
