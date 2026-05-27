package com.mniu.aicamp.user.application;

import com.mniu.aicamp.IntegrationTestBase;
import com.mniu.aicamp.project.domain.ProjectStatus;
import com.mniu.aicamp.shared.exception.BusinessException;
import com.mniu.aicamp.shared.ratelimit.RedisSlidingWindowRateLimiter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PlatformServiceTest extends IntegrationTestBase {
    @Autowired
    private PlatformService service;

    @Autowired
    private RedisSlidingWindowRateLimiter rateLimiter;

    @Test
    void registerLoginAndRotateRefreshToken() {
        PlatformService.Tokens first = service.register("dev@example.com", "password1", "Dev");
        PlatformService.Tokens second = service.login("dev@example.com", "password1");

        assertThat(first.accessToken()).startsWith("acc_");
        assertThat(second.refreshToken()).startsWith("ref_");
        PlatformService.Tokens rotated = service.refresh(first.refreshToken());
        assertThat(rotated.refreshToken()).isNotEqualTo(first.refreshToken());
        assertThatThrownBy(() -> service.refresh(first.refreshToken())).isInstanceOf(BusinessException.class);
        assertThat(service.authenticate("missing")).isEmpty();
        assertThatThrownBy(() -> service.register("dev@example.com", "short", "Dev")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.register("dev@example.com", "password1", "Dev")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.login("dev@example.com", "wrong-password")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.login("missing@example.com", "password1")).isInstanceOf(BusinessException.class);
    }

    @Test
    void profileSkillsAndMissingUserBranchesWork() {
        var tokens = service.register("profile@example.com", "password1", "");
        var user = service.authenticate(tokens.accessToken()).orElseThrow();

        assertThat(service.getUser(user.id()).displayName()).isEqualTo("profile@example.com");
        service.updateProfile(user.id(), "", "Goal", null);
        service.updateSkills(user.id(), List.of("Java", "Spring"));

        assertThat(service.getUser(user.id()).skills()).containsExactly("Java", "Spring");
        assertThat(service.getUser(user.id()).goal()).isEqualTo("Goal");
        assertThatThrownBy(() -> service.getUser(-1L)).isInstanceOf(BusinessException.class);
    }

    @Test
    void redisBackedRateLimiterRejectsAboveLimit() {
        String key = "it-" + System.nanoTime();

        assertThat(rateLimiter.allow(key, 1, 60_000)).isTrue();
        assertThat(rateLimiter.allow(key, 1, 60_000)).isFalse();
    }

    @Test
    void onlyLatestGeneratedRoadmapIsActiveAndTaskCompletionAddsXp() {
        var tokens = service.register("roadmap@example.com", "password1", "Road");
        var user = service.authenticate(tokens.accessToken()).orElseThrow();

        service.generateRoadmap(user.id(), "AI Engineer", 10, 2);
        PlatformService.Roadmap latest = service.generateRoadmap(user.id(), "Agent Engineer", 8, 1);

        assertThat(service.listRoadmaps(user.id())).hasSize(2);
        assertThat(service.getRoadmap(user.id(), latest.id()).targetRole()).isEqualTo("Agent Engineer");
        assertThat(service.listRoadmaps(user.id()).stream().filter(PlatformService.Roadmap::active).count()).isEqualTo(1);
        service.updateRoadmapTask(user.id(), latest.tasks().get(0).id(), true);
        assertThat(service.roadmapProgress(user.id(), latest.id()).completionPercent()).isEqualTo(100);
        service.updateRoadmapTask(user.id(), latest.tasks().get(0).id(), false);
        assertThat(service.getGrowth(user.id()).xp()).isGreaterThanOrEqualTo(70);
        PlatformService.Roadmap first = service.listRoadmaps(user.id()).getFirst();
        assertThat(service.activateRoadmap(user.id(), first.id()).active()).isTrue();
        assertThatThrownBy(() -> service.getRoadmap(user.id(), -1L)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.updateRoadmapTask(user.id(), -1L, true)).isInstanceOf(BusinessException.class);
        var other = service.register("empty-roadmap@example.com", "password1", "Empty");
        var emptyUser = service.authenticate(other.accessToken()).orElseThrow();
        assertThat(service.listRoadmaps(emptyUser.id())).isEmpty();
        assertThatThrownBy(() -> service.activeRoadmap(emptyUser.id())).isInstanceOf(BusinessException.class);
    }

    @Test
    void coachProjectReviewAndNotificationsAffectGrowth() {
        var tokens = service.register("flow@example.com", "password1", "Flow");
        var user = service.authenticate(tokens.accessToken()).orElseThrow();

        var session = service.createSession(user.id(), "General", "GENERAL");
        var answered = service.sendMessage(user.id(), session.id(), "How do I practice TDD?");
        assertThat(answered.messages()).hasSize(2);
        assertThat(service.getSession(user.id(), session.id()).messages()).hasSize(2);
        assertThat(service.listSessions(user.id())).hasSize(1);
        assertThatThrownBy(() -> service.sendMessage(user.id(), -1L, "hello")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.sendMessage(user.id(), session.id(), "x".repeat(12001))).isInstanceOf(BusinessException.class);

        var project = service.createProject(user.id(), "RAG demo", "RAG");
        assertThat(service.listProjects(user.id())).hasSize(1);
        assertThat(service.getProject(user.id(), project.id()).name()).isEqualTo("RAG demo");
        assertThat(service.discussProject(user.id(), project.id()).contextType()).isEqualTo("PROJECT");
        assertThatThrownBy(() -> service.updateProjectStatus(user.id(), project.id(), ProjectStatus.COMPLETED))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.updateProjectTask(user.id(), project.id(), -1L, true))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.updateProjectStatus(user.id(), -1L, ProjectStatus.COMPLETED))
                .isInstanceOf(BusinessException.class);
        project.tasks().forEach(task -> service.updateProjectTask(user.id(), project.id(), task.id(), true));
        service.updateProjectStatus(user.id(), project.id(), ProjectStatus.COMPLETED);

        var review = service.reviewSnippet(user.id(), "java", "class A {}");
        assertThat(review.score()).isEqualTo(86);
        assertThat(service.listReviews(user.id())).hasSize(1);
        assertThat(service.getReview(user.id(), review.id()).id()).isEqualTo(review.id());
        assertThatThrownBy(() -> service.getReview(user.id(), -1L)).isInstanceOf(BusinessException.class);
        assertThat(service.unreadNotifications(user.id())).isGreaterThan(0);
        var firstNotification = service.notifications(user.id()).get(0);
        service.markNotificationRead(user.id(), firstNotification.id());
        service.markNotificationRead(user.id(), -1L);
        assertThat(service.notifications(user.id()).get(0).read()).isTrue();
        service.markAllNotificationsRead(user.id());
        assertThat(service.unreadNotifications(user.id())).isZero();
        assertThatThrownBy(() -> service.reviewSnippet(user.id(), "java", "x".repeat(204801))).isInstanceOf(BusinessException.class);
        assertThat(service.achievements(user.id())).isNotEmpty();
        assertThat(service.getGrowth(user.id()).activityLog()).contains("PROJECT_COMPLETED", "CODE_REVIEW_CREATED");
        assertThat(service.activityLog(user.id())).contains("PROJECT_COMPLETED", "CODE_REVIEW_CREATED");
    }
}

