package com.mniu.aicamp.landing.application;

import com.mniu.aicamp.coach.application.CoachService;
import com.mniu.aicamp.project.application.ProjectService;
import com.mniu.aicamp.user.infrastructure.mapper.UserMapper;
import org.springframework.stereotype.Service;

@Service
public class LandingService {
    private final UserMapper users;
    private final ProjectService projectService;
    private final CoachService coachService;

    public LandingService(UserMapper users, ProjectService projectService, CoachService coachService) {
        this.users = users;
        this.projectService = projectService;
        this.coachService = coachService;
    }

    public LandingStats landingStats() {
        return new LandingStats(users.selectCount(null), projectService.totalProjects(), coachService.totalMessages());
    }

    public record LandingStats(long totalLearners, long totalProjects, long totalCoachMessages) {
    }
}
