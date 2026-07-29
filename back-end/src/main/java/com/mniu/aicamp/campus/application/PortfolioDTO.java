package com.mniu.aicamp.campus.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.util.List;

/**
 * 作品集展示 DTO
 */
public record PortfolioDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long userId,
        String username,
        String school,
        String level,
        String pathName,
        String bio,
        List<String> skills,
        List<ProjectItemDTO> projects,
        PortfolioStatsDTO stats
) {
    public record ProjectItemDTO(
            @JsonSerialize(using = ToStringSerializer.class) Long id,
            String name,
            String description,
            List<String> techStack,
            String githubUrl,
            String demoUrl
    ) {}

    public record PortfolioStatsDTO(
            int practicePassed,
            int interviewRounds,
            int completedWeeks,
            int streakDays
    ) {}
}
