package com.mniu.aicamp.user.application;

import com.mniu.aicamp.IntegrationTestBase;
import com.mniu.aicamp.auth.application.AuthService;
import com.mniu.aicamp.coach.application.ChatMessage;
import com.mniu.aicamp.coach.application.CoachService;
import com.mniu.aicamp.growth.application.GrowthService;
import com.mniu.aicamp.growth.infrastructure.mapper.GrowthMapper;
import com.mniu.aicamp.landing.application.LandingService;
import com.mniu.aicamp.notification.application.NotificationService;
import com.mniu.aicamp.project.application.ProjectService;
import com.mniu.aicamp.project.domain.ProjectStatus;
import com.mniu.aicamp.roadmap.application.Roadmap;
import com.mniu.aicamp.roadmap.application.RoadmapService;
import com.mniu.aicamp.review.application.CodeReviewService;
import com.mniu.aicamp.shared.exception.BusinessException;
import com.mniu.aicamp.shared.ratelimit.RedisSlidingWindowRateLimiter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ApplicationServicesTest extends IntegrationTestBase {
    @Autowired
    private AuthService authService;

    @Autowired
    private UserAccountService userAccounts;

    @Autowired
    private LandingService landingService;

    @Autowired
    private CodeReviewService codeReviews;

    @Autowired
    private CoachService coach;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private RoadmapService roadmaps;

    @Autowired
    private GrowthService growth;

    @Autowired
    private NotificationService notifications;

    @Autowired
    private RedisSlidingWindowRateLimiter rateLimiter;

    @Autowired
    private StringRedisTemplate redis;

    @Autowired
    private GrowthMapper growthMapper;

    @Test
    void registerLoginAndRotateRefreshToken() {
        AuthService.Tokens first = authService.register("dev@example.com", "password1", "Dev");
        AuthService.Tokens second = authService.login("dev@example.com", "password1");

        assertThat(first.accessToken()).startsWith("acc_");
        assertThat(second.refreshToken()).startsWith("ref_");
        AuthService.Tokens rotated = authService.refresh(first.refreshToken());
        assertThat(rotated.refreshToken()).isNotEqualTo(first.refreshToken());
        assertThatThrownBy(() -> authService.refresh(first.refreshToken())).isInstanceOf(BusinessException.class);
        assertThat(authService.authenticate("missing")).isEmpty();
        assertThatThrownBy(() -> authService.register("dev@example.com", "short", "Dev")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> authService.register("dev@example.com", "password1", "Dev")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> authService.login("dev@example.com", "wrong-password")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> authService.login("missing@example.com", "password1")).isInstanceOf(BusinessException.class);

        redis.opsForValue().set("auth:access:deleted-user", "-1", 1, TimeUnit.MINUTES);
        assertThat(authService.authenticate("deleted-user")).isEmpty();
    }

    @Test
    void profileSkillsAndMissingUserBranchesWork() {
        var tokens = authService.register("profile@example.com", "password1", "");
        var user = authService.authenticate(tokens.accessToken()).orElseThrow();

        assertThat(userAccounts.getUser(user.id()).displayName()).isEqualTo("profile@example.com");
        userAccounts.updateProfile(user.id(), "", "Goal", null);
        userAccounts.updateSkills(user.id(), List.of("Java", "Spring"));

        assertThat(userAccounts.getUser(user.id()).skills()).containsExactly("Java", "Spring");
        assertThat(userAccounts.getUser(user.id()).goal()).isEqualTo("Goal");
        assertThatThrownBy(() -> userAccounts.getUser(-1L)).isInstanceOf(BusinessException.class);
    }

    @Test
    void roadmapRegenerationAndWeekProgressUpdateWork() {
        var tokens = authService.register("roadmap-progress@example.com", "password1", "Road Progress");
        var user = authService.authenticate(tokens.accessToken()).orElseThrow();
        var roadmap = roadmaps.generateRoadmap(user.id(), "AI Engineer", 10, 2);

        var regenerated = roadmaps.regenerateRoadmap(user.id(), roadmap.id(), null, null, null);
        assertThat(regenerated.targetRole()).isEqualTo("AI Engineer");
        assertThat(regenerated.tasks()).hasSize(2);

        var progress = roadmaps.updateRoadmapProgress(user.id(), regenerated.id(), 1, 0, "COMPLETED");
        assertThat(progress.completedTasks()).isEqualTo(1);
        assertThatThrownBy(() -> roadmaps.updateRoadmapProgress(user.id(), regenerated.id(), 1, 99, "COMPLETED"))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void codeReviewCanAutoCompleteMatchingRoadmapTask() {
        var tokens = authService.register("roadmap-review-auto@example.com", "password1", "Road Review");
        var user = authService.authenticate(tokens.accessToken()).orElseThrow();
        var roadmap = roadmaps.generateRoadmap(user.id(), "AI Engineer", 10, 2);

        assertThat(roadmaps.roadmapProgress(user.id(), roadmap.id()).completedTasks()).isZero();

        var review = codeReviews.reviewSnippet(user.id(), "java", "class A {}");
        assertThat(review.score()).isGreaterThanOrEqualTo(80);

        var progress = roadmaps.roadmapProgress(user.id(), roadmap.id());
        assertThat(progress.completedTasks()).isGreaterThanOrEqualTo(1);
        assertThat(progress.items().getFirst().status()).isEqualTo("COMPLETED");
    }

    @Test
    void redisBackedRateLimiterRejectsAboveLimit() {
        String key = "it-" + System.nanoTime();

        assertThat(rateLimiter.allow(key, 1, 60_000)).isTrue();
        assertThat(rateLimiter.allow(key, 1, 60_000)).isFalse();
    }

    @Test
    void onlyLatestGeneratedRoadmapIsActiveAndTaskCompletionAddsXp() {
        var tokens = authService.register("roadmap@example.com", "password1", "Road");
        var user = authService.authenticate(tokens.accessToken()).orElseThrow();

        roadmaps.generateRoadmap(user.id(), "AI Engineer", 10, 2);
        Roadmap latest = roadmaps.generateRoadmap(user.id(), "Agent Engineer", 8, 1);

        assertThat(roadmaps.listRoadmaps(user.id())).hasSize(2);
        assertThat(roadmaps.getRoadmap(user.id(), latest.id()).targetRole()).isEqualTo("Agent Engineer");
        assertThat(roadmaps.listRoadmaps(user.id()).stream().filter(Roadmap::active).count()).isEqualTo(1);
        latest.tasks().forEach(task -> roadmaps.updateRoadmapTask(user.id(), task.id(), true));
        assertThat(roadmaps.roadmapProgress(user.id(), latest.id()).completionPercent()).isEqualTo(100);
        roadmaps.updateRoadmapTask(user.id(), latest.tasks().get(0).id(), false);
        assertThat(growth.getGrowth(user.id()).xp()).isGreaterThanOrEqualTo(70);
        Roadmap first = roadmaps.listRoadmaps(user.id()).getFirst();
        assertThat(roadmaps.activateRoadmap(user.id(), first.id()).active()).isTrue();
        assertThatThrownBy(() -> roadmaps.getRoadmap(user.id(), -1L)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> roadmaps.updateRoadmapTask(user.id(), -1L, true)).isInstanceOf(BusinessException.class);
        var other = authService.register("empty-roadmap@example.com", "password1", "Empty");
        var emptyUser = authService.authenticate(other.accessToken()).orElseThrow();
        assertThat(roadmaps.listRoadmaps(emptyUser.id())).isEmpty();
        assertThatThrownBy(() -> roadmaps.activeRoadmap(emptyUser.id())).isInstanceOf(BusinessException.class);
    }

    @Test
    void coachProjectReviewAndNotificationsAffectGrowth() {
        var tokens = authService.register("flow@example.com", "password1", "Flow");
        var user = authService.authenticate(tokens.accessToken()).orElseThrow();

        var session = coach.createSession(user.id(), "General", "GENERAL");
        var answered = coach.sendMessage(user.id(), session.id(), "How do I practice TDD?");
        assertThat(answered.messages()).hasSize(2);
        assertThat(coach.getSession(user.id(), session.id()).messages()).hasSize(2);
        assertThat(coach.listMessages(user.id(), session.id())).hasSize(2);
        coach.clearSession(user.id(), session.id());
        assertThat(coach.listMessages(user.id(), session.id())).isEmpty();
        coach.sendMessage(user.id(), session.id(), "Start again");
        assertThat(coach.listSessions(user.id())).hasSize(1);
        assertThatThrownBy(() -> coach.sendMessage(user.id(), -1L, "hello")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> coach.sendMessage(user.id(), session.id(), "x".repeat(12001))).isInstanceOf(BusinessException.class);

        var project = projectService.createProject(user.id(), "RAG demo", "RAG");
        assertThat(projectService.listProjects(user.id())).hasSize(1);
        assertThat(projectService.getProject(user.id(), project.id()).name()).isEqualTo("RAG demo");
        assertThat(projectService.updateProject(user.id(), project.id(), "RAG demo v2", null).name()).isEqualTo("RAG demo v2");
        assertThat(projectService.discussProject(user.id(), project.id()).contextType()).isEqualTo("PROJECT");
        assertThatThrownBy(() -> projectService.updateProjectStatus(user.id(), project.id(), ProjectStatus.COMPLETED))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> projectService.updateProjectTask(user.id(), project.id(), -1L, true))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> projectService.updateProjectStatus(user.id(), -1L, ProjectStatus.COMPLETED))
                .isInstanceOf(BusinessException.class);
        projectService.getProject(user.id(), project.id()).tasks()
                .forEach(task -> projectService.updateProjectTask(user.id(), project.id(), task.id(), true));
        projectService.updateProject(user.id(), project.id(), null, ProjectStatus.COMPLETED);

        var review = codeReviews.reviewSnippet(user.id(), "java", "class A {}");
        assertThat(review.score()).isEqualTo(86);
        var repositoryReview = codeReviews.reviewRepository(user.id(), "git@github.com:mniu/repo.git", "main", "java");
        assertThat(repositoryReview.suggestions().get(0))
                .contains("仓库审查", "mniu/repo");
        assertThat(String.join("\n", repositoryReview.suggestions()))
                .contains("已审查文件", "AI 审查", "请使用简体中文")
                .doesNotContain("Repository review", "Files reviewed", "AI review");
        assertThat(codeReviews.reviewRepository(user.id(), "github.com/mniu/direct", null, "").language()).isEqualTo("repository");
        assertThatThrownBy(() -> codeReviews.reviewRepository(user.id(), "", "main", "java")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> codeReviews.reviewRepository(user.id(), "https://github.com/mniu", "main", "java")).isInstanceOf(BusinessException.class);
        assertThat(codeReviews.listReviews(user.id())).hasSizeGreaterThanOrEqualTo(3);
        assertThat(codeReviews.getReview(user.id(), review.id()).id()).isEqualTo(review.id());
        assertThatThrownBy(() -> codeReviews.getReview(user.id(), -1L)).isInstanceOf(BusinessException.class);
        assertThat(notifications.unreadNotifications(user.id())).isGreaterThan(0);
        var firstNotification = notifications.listNotifications(user.id()).get(0);
        notifications.markNotificationRead(user.id(), firstNotification.id());
        notifications.markNotificationRead(user.id(), -1L);
        assertThat(notifications.listNotifications(user.id()).get(0).read()).isTrue();
        notifications.markAllNotificationsRead(user.id());
        assertThat(notifications.unreadNotifications(user.id())).isZero();
        assertThatThrownBy(() -> codeReviews.reviewSnippet(user.id(), "java", "x".repeat(204801))).isInstanceOf(BusinessException.class);
        assertThat(growth.achievements(user.id())).isNotEmpty();
        assertThat(growth.getGrowth(user.id()).activityLog()).contains("PROJECT_COMPLETED", "CODE_REVIEW_CREATED");
        assertThat(growth.activityLog(user.id())).contains("PROJECT_COMPLETED", "CODE_REVIEW_CREATED");
        assertThat(landingService.landingStats().totalLearners()).isPositive();
        coach.deleteSession(user.id(), session.id());
        assertThatThrownBy(() -> coach.getSession(user.id(), session.id())).isInstanceOf(BusinessException.class);
        projectService.deleteProject(user.id(), project.id());
        assertThatThrownBy(() -> projectService.getProject(user.id(), project.id())).isInstanceOf(BusinessException.class);
        growthMapper.deleteById(user.id());
        assertThatThrownBy(() -> growth.getGrowth(user.id())).isInstanceOf(BusinessException.class);
    }

    @Test
    void coachMessagesIncludeShortTermAndLongTermMemory() {
        var tokens = authService.register("memory@example.com", "password1", "Memory");
        var user = authService.authenticate(tokens.accessToken()).orElseThrow();
        userAccounts.updateProfile(user.id(), "Memory", "Build context aware AI coach", 12);
        userAccounts.updateSkills(user.id(), List.of("Java", "Spring"));
        roadmaps.generateRoadmap(user.id(), "AI Engineer", 10, 2);
        projectService.createProject(user.id(), "Memory RAG", "RAG");

        var previousSession = coach.createSession(user.id(), "Previous", "GENERAL");
        coach.sendMessage(user.id(), previousSession.id(), "My long-term preference is backend TDD.");

        var currentSession = coach.createSession(user.id(), "Current", "GENERAL");
        coach.sendMessage(user.id(), currentSession.id(), "I am fixing an SSE bug.");
        var answered = coach.sendMessage(user.id(), currentSession.id(), "What should I do next?");

        String assistantAnswer = answered.messages().getLast().content();
        assertThat(assistantAnswer)
                .contains("Long-term memory")
                .contains("Build context aware AI coach", "Java", "Spring")
                .contains("Active roadmap: AI Engineer")
                .contains("Active projects", "Memory RAG")
                .contains("Recent cross-session memory", "My long-term preference is backend TDD.")
                .contains("Short-term conversation memory", "I am fixing an SSE bug.", "What should I do next?");
    }

    @Test
    void coachStreamMessageReturnsChunksAndPersistsContextualAnswer() {
        var tokens = authService.register("stream-memory@example.com", "password1", "Stream Memory");
        var user = authService.authenticate(tokens.accessToken()).orElseThrow();
        userAccounts.updateProfile(user.id(), "Stream Memory", "Keep streaming context", 6);

        var session = coach.createSession(user.id(), "Streaming", "GENERAL");
        List<String> chunks = coach.streamMessage(user.id(), session.id(), "Stream with memory");

        assertThat(chunks).hasSizeGreaterThanOrEqualTo(2);
        assertThat(coach.listMessages(user.id(), session.id()))
                .extracting(ChatMessage::role)
                .containsExactly("user", "assistant");
        assertThat(coach.listMessages(user.id(), session.id()).getLast().content())
                .contains("Long-term memory", "Keep streaming context", "Current user message", "Stream with memory");
        assertThatThrownBy(() -> coach.streamMessage(user.id(), session.id(), "x".repeat(12001)))
                .isInstanceOf(BusinessException.class);
    }
}

