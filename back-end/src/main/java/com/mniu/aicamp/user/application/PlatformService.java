package com.mniu.aicamp.user.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.mniu.aicamp.coach.infrastructure.mapper.ChatMessageMapper;
import com.mniu.aicamp.coach.infrastructure.mapper.CoachSessionMapper;
import com.mniu.aicamp.coach.infrastructure.po.ChatMessagePO;
import com.mniu.aicamp.coach.infrastructure.po.CoachSessionPO;
import com.mniu.aicamp.growth.infrastructure.mapper.GrowthMapper;
import com.mniu.aicamp.growth.infrastructure.po.GrowthPO;
import com.mniu.aicamp.notification.infrastructure.mapper.NotificationMapper;
import com.mniu.aicamp.notification.infrastructure.po.NotificationPO;
import com.mniu.aicamp.project.domain.ProjectStatus;
import com.mniu.aicamp.project.infrastructure.mapper.ProjectMapper;
import com.mniu.aicamp.project.infrastructure.mapper.ProjectTaskMapper;
import com.mniu.aicamp.project.infrastructure.po.ProjectPO;
import com.mniu.aicamp.project.infrastructure.po.ProjectTaskPO;
import com.mniu.aicamp.review.infrastructure.mapper.CodeReviewMapper;
import com.mniu.aicamp.review.infrastructure.po.CodeReviewPO;
import com.mniu.aicamp.roadmap.infrastructure.mapper.RoadmapMapper;
import com.mniu.aicamp.roadmap.infrastructure.mapper.RoadmapTaskMapper;
import com.mniu.aicamp.roadmap.infrastructure.po.RoadmapPO;
import com.mniu.aicamp.roadmap.infrastructure.po.RoadmapTaskPO;
import com.mniu.aicamp.shared.ai.AiClientPort;
import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import com.mniu.aicamp.shared.security.CurrentUser;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import com.mniu.aicamp.user.infrastructure.mapper.UserMapper;
import com.mniu.aicamp.user.infrastructure.po.UserPO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PlatformService {
    private final PasswordEncoder passwordEncoder;
    private final StringRedisTemplate redis;
    private final AiClientPort aiClient;
    private final SnowflakeIdGenerator idGenerator;
    private final UserMapper users;
    private final GrowthMapper growthRows;
    private final NotificationMapper notifications;
    private final RoadmapMapper roadmaps;
    private final RoadmapTaskMapper roadmapTasks;
    private final CoachSessionMapper sessions;
    private final ChatMessageMapper messages;
    private final ProjectMapper projects;
    private final ProjectTaskMapper projectTasks;
    private final CodeReviewMapper reviews;
    private final Duration accessTokenTtl;
    private final Duration refreshTokenTtl;

    public PlatformService(PasswordEncoder passwordEncoder,
                           StringRedisTemplate redis,
                           AiClientPort aiClient,
                           SnowflakeIdGenerator idGenerator,
                           UserMapper users,
                           GrowthMapper growthRows,
                           NotificationMapper notifications,
                           RoadmapMapper roadmaps,
                           RoadmapTaskMapper roadmapTasks,
                           CoachSessionMapper sessions,
                           ChatMessageMapper messages,
                           ProjectMapper projects,
                           ProjectTaskMapper projectTasks,
                           CodeReviewMapper reviews,
                           @Value("${app.security.jwt.access-token-ttl:15m}") Duration accessTokenTtl,
                           @Value("${app.security.jwt.refresh-token-ttl:7d}") Duration refreshTokenTtl) {
        this.passwordEncoder = passwordEncoder;
        this.redis = redis;
        this.aiClient = aiClient;
        this.idGenerator = idGenerator;
        this.users = users;
        this.growthRows = growthRows;
        this.notifications = notifications;
        this.roadmaps = roadmaps;
        this.roadmapTasks = roadmapTasks;
        this.sessions = sessions;
        this.messages = messages;
        this.projects = projects;
        this.projectTasks = projectTasks;
        this.reviews = reviews;
        this.accessTokenTtl = accessTokenTtl;
        this.refreshTokenTtl = refreshTokenTtl;
    }

    @Transactional
    public Tokens register(String email, String password, String displayName) {
        if (password == null || password.length() < 8) {
            throw new BusinessException(ErrorCode.WEAK_PASSWORD, "Password must contain at least 8 characters");
        }
        String normalized = email.toLowerCase();
        Long userId = idGenerator.nextId();
        UserPO user = new UserPO();
        user.setId(userId);
        user.setEmail(normalized);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setDisplayName(displayName == null || displayName.isBlank() ? normalized : displayName);
        user.setSkills("");
        user.setGoal("");
        user.setWeeklyHours(0);
        try {
            users.insert(user);
        } catch (DuplicateKeyException ex) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS, "Email already exists");
        }
        GrowthPO growth = new GrowthPO();
        growth.setUserId(userId);
        growth.setXp(0);
        growth.setLevel(1);
        growth.setStreakDays(0);
        growth.setAchievements("");
        growth.setActivityLog("");
        growthRows.insert(growth);
        addNotification(userId, "WELCOME", "Welcome to MNIU AI Camp");
        return issueTokens(userId);
    }

    public Tokens login(String email, String password) {
        UserAccount account = findUserByEmail(email.toLowerCase())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS, "Invalid email or password"));
        if (!passwordEncoder.matches(password, account.passwordHash())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS, "Invalid email or password");
        }
        return issueTokens(account.id());
    }

    public Tokens refresh(String refreshToken) {
        String key = refreshKey(refreshToken);
        String value = redis.opsForValue().get(key);
        if (value == null) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_INVALID, "Refresh token is invalid");
        }
        redis.delete(key);
        return issueTokens(Long.parseLong(value));
    }

    public Optional<CurrentUser> authenticate(String token) {
        String userId = redis.opsForValue().get(accessKey(token));
        if (userId == null) {
            return Optional.empty();
        }
        try {
            UserAccount account = getUser(Long.parseLong(userId));
            return Optional.of(new CurrentUser(account.id(), account.email()));
        } catch (RuntimeException ex) {
            return Optional.empty();
        }
    }

    public UserAccount getUser(Long userId) {
        UserPO po = users.selectById(userId);
        if (po == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND, "User not found");
        }
        return toUserAccount(po);
    }

    public UserAccount updateProfile(Long userId, String displayName, String goal, Integer weeklyHours) {
        UserAccount current = getUser(userId);
        UserPO update = new UserPO();
        update.setId(userId);
        update.setDisplayName(blankTo(displayName, current.displayName()));
        update.setGoal(blankTo(goal, current.goal()));
        update.setWeeklyHours(weeklyHours == null ? current.weeklyHours() : weeklyHours);
        users.updateById(update);
        return getUser(userId);
    }

    public UserAccount updateSkills(Long userId, List<String> skills) {
        getUser(userId);
        UserPO update = new UserPO();
        update.setId(userId);
        update.setSkills(join(skills));
        users.updateById(update);
        return getUser(userId);
    }

    @Transactional
    public Roadmap generateRoadmap(Long userId, String targetRole, int weeklyHours, int durationWeeks) {
        getUser(userId);
        roadmaps.update(null, Wrappers.<RoadmapPO>lambdaUpdate()
                .eq(RoadmapPO::getUserId, userId)
                .set(RoadmapPO::getActive, false));
        Long roadmapId = idGenerator.nextId();
        RoadmapPO roadmap = new RoadmapPO();
        roadmap.setId(roadmapId);
        roadmap.setUserId(userId);
        roadmap.setTargetRole(targetRole);
        roadmap.setWeeklyHours(weeklyHours);
        roadmap.setActive(true);
        roadmaps.insert(roadmap);
        for (int week = 1; week <= Math.max(1, durationWeeks); week++) {
            RoadmapTaskPO task = new RoadmapTaskPO();
            task.setId(idGenerator.nextId());
            task.setRoadmapId(roadmapId);
            task.setWeek(week);
            task.setTitle("Week " + week + " " + targetRole + " practice");
            task.setCompleted(false);
            roadmapTasks.insert(task);
        }
        addXp(userId, 20, "ROADMAP_GENERATED");
        return loadRoadmap(roadmapId);
    }

    @Transactional
    public Roadmap regenerateRoadmap(Long userId, Long roadmapId, String targetRole, Integer weeklyHours, Integer durationWeeks) {
        Roadmap current = getRoadmap(userId, roadmapId);
        return generateRoadmap(userId, blankTo(targetRole, current.targetRole()),
                weeklyHours == null ? current.weeklyHours() : weeklyHours,
                durationWeeks == null ? Math.max(1, current.tasks().stream().mapToInt(RoadmapTask::week).max().orElse(1)) : durationWeeks);
    }

    public List<Roadmap> listRoadmaps(Long userId) {
        return roadmaps.selectList(Wrappers.<RoadmapPO>lambdaQuery()
                        .eq(RoadmapPO::getUserId, userId)
                        .orderByAsc(RoadmapPO::getCreatedAt))
                .stream().map(po -> loadRoadmap(po.getId())).toList();
    }

    public Roadmap getRoadmap(Long userId, Long roadmapId) {
        RoadmapPO po = roadmaps.selectOne(Wrappers.<RoadmapPO>lambdaQuery()
                .eq(RoadmapPO::getId, roadmapId)
                .eq(RoadmapPO::getUserId, userId));
        if (po == null) {
            throw new BusinessException(ErrorCode.ROADMAP_NOT_FOUND, "Roadmap not found");
        }
        return loadRoadmap(roadmapId);
    }

    public Roadmap activeRoadmap(Long userId) {
        RoadmapPO po = roadmaps.selectOne(Wrappers.<RoadmapPO>lambdaQuery()
                .eq(RoadmapPO::getUserId, userId)
                .eq(RoadmapPO::getActive, true));
        if (po == null) {
            throw new BusinessException(ErrorCode.ROADMAP_NOT_FOUND, "Active roadmap not found");
        }
        return loadRoadmap(po.getId());
    }

    @Transactional
    public Roadmap activateRoadmap(Long userId, Long roadmapId) {
        getRoadmap(userId, roadmapId);
        roadmaps.update(null, Wrappers.<RoadmapPO>lambdaUpdate()
                .eq(RoadmapPO::getUserId, userId)
                .set(RoadmapPO::getActive, false));
        roadmaps.update(null, Wrappers.<RoadmapPO>lambdaUpdate()
                .eq(RoadmapPO::getId, roadmapId)
                .eq(RoadmapPO::getUserId, userId)
                .set(RoadmapPO::getActive, true));
        return loadRoadmap(roadmapId);
    }

    public RoadmapProgress roadmapProgress(Long userId, Long roadmapId) {
        Roadmap roadmap = getRoadmap(userId, roadmapId);
        long completed = roadmap.tasks().stream().filter(RoadmapTask::completed).count();
        int percent = roadmap.tasks().isEmpty() ? 0 : (int) Math.round(completed * 100.0 / roadmap.tasks().size());
        return new RoadmapProgress(roadmap.id(), roadmap.tasks().size(), (int) completed, percent);
    }

    @Transactional
    public Roadmap updateRoadmapTask(Long userId, Long taskId, boolean completed) {
        Roadmap roadmap = activeRoadmap(userId);
        RoadmapTask task = roadmap.tasks().stream().filter(t -> t.id().equals(taskId)).findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.ROADMAP_TASK_NOT_FOUND, "Roadmap task not found"));
        roadmapTasks.update(null, Wrappers.<RoadmapTaskPO>lambdaUpdate()
                .eq(RoadmapTaskPO::getId, taskId)
                .set(RoadmapTaskPO::getCompleted, completed));
        if (!task.completed() && completed) {
            addXp(userId, 30, "ROADMAP_TASK_COMPLETED");
            addNotification(userId, "XP_GAINED", "Roadmap task completed");
        }
        return loadRoadmap(roadmap.id());
    }

    @Transactional
    public RoadmapProgress updateRoadmapProgress(Long userId, Long roadmapId, int weekNumber, int taskIndex, String status) {
        Roadmap roadmap = getRoadmap(userId, roadmapId);
        List<RoadmapTask> weekTasks = roadmap.tasks().stream()
                .filter(task -> task.week() == weekNumber)
                .toList();
        if (taskIndex < 0 || taskIndex >= weekTasks.size()) {
            throw new BusinessException(ErrorCode.ROADMAP_TASK_NOT_FOUND, "Roadmap task not found");
        }
        RoadmapTask task = weekTasks.get(taskIndex);
        boolean completed = "COMPLETED".equalsIgnoreCase(status);
        roadmapTasks.update(null, Wrappers.<RoadmapTaskPO>lambdaUpdate()
                .eq(RoadmapTaskPO::getId, task.id())
                .set(RoadmapTaskPO::getCompleted, completed));
        if (!task.completed() && completed) {
            addXp(userId, 30, "ROADMAP_TASK_COMPLETED");
            addNotification(userId, "XP_GAINED", "Roadmap task completed");
        }
        return roadmapProgress(userId, roadmapId);
    }

    public CoachSession createSession(Long userId, String title, String contextType) {
        getUser(userId);
        Long id = idGenerator.nextId();
        CoachSessionPO session = new CoachSessionPO();
        session.setId(id);
        session.setUserId(userId);
        session.setTitle(blankTo(title, "AI Coach"));
        session.setContextType(contextType);
        sessions.insert(session);
        return loadSession(id);
    }

    @Transactional
    public CoachSession sendMessage(Long userId, Long sessionId, String content) {
        if (content.length() > 12000) {
            throw new BusinessException(ErrorCode.MESSAGE_TOO_LONG, "Message is too long");
        }
        findSession(userId, sessionId);
        insertMessage(sessionId, "user", content);
        String answer = aiClient.chat("You are an AI programming coach.", content);
        insertMessage(sessionId, "assistant", answer);
        addXp(userId, 5, "COACH_MESSAGE_SENT");
        return loadSession(sessionId);
    }

    public List<CoachSession> listSessions(Long userId) {
        return sessions.selectList(Wrappers.<CoachSessionPO>lambdaQuery()
                        .eq(CoachSessionPO::getUserId, userId)
                        .orderByAsc(CoachSessionPO::getCreatedAt))
                .stream().map(po -> loadSession(po.getId())).toList();
    }

    public CoachSession getSession(Long userId, Long sessionId) {
        return findSession(userId, sessionId);
    }

    public List<ChatMessage> listMessages(Long userId, Long sessionId) {
        return findSession(userId, sessionId).messages();
    }

    public void clearSession(Long userId, Long sessionId) {
        findSession(userId, sessionId);
        messages.delete(Wrappers.<ChatMessagePO>lambdaQuery().eq(ChatMessagePO::getSessionId, sessionId));
    }

    public void deleteSession(Long userId, Long sessionId) {
        findSession(userId, sessionId);
        sessions.deleteById(sessionId);
    }

    @Transactional
    public Project createProject(Long userId, String name, String type) {
        getUser(userId);
        Long id = idGenerator.nextId();
        ProjectPO project = new ProjectPO();
        project.setId(id);
        project.setUserId(userId);
        project.setName(name);
        project.setType(type);
        project.setStatus(ProjectStatus.ACTIVE.name());
        projects.insert(project);
        insertProjectTask(id, "Define scope", true);
        insertProjectTask(id, "Build first vertical slice", false);
        insertProjectTask(id, "Add tests and polish", false);
        addXp(userId, 15, "PROJECT_CREATED");
        return loadProject(id);
    }

    public Project updateProjectTask(Long userId, Long projectId, Long taskId, boolean completed) {
        Project project = findProject(userId, projectId);
        boolean exists = project.tasks().stream().anyMatch(t -> t.id().equals(taskId));
        if (!exists) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Project task not found");
        }
        projectTasks.update(null, Wrappers.<ProjectTaskPO>lambdaUpdate()
                .eq(ProjectTaskPO::getId, taskId)
                .set(ProjectTaskPO::getCompleted, completed));
        return loadProject(projectId);
    }

    @Transactional
    public Project updateProject(Long userId, Long projectId, String name, ProjectStatus status) {
        Project project = findProject(userId, projectId);
        if (status != null) {
            project.status().assertCanTransitionTo(status, completion(project.tasks()));
        }
        projects.update(null, Wrappers.<ProjectPO>lambdaUpdate()
                .eq(ProjectPO::getId, projectId)
                .eq(ProjectPO::getUserId, userId)
                .set(name != null && !name.isBlank(), ProjectPO::getName, name)
                .set(status != null, ProjectPO::getStatus, status == null ? null : status.name()));
        if (status == ProjectStatus.COMPLETED) {
            addXp(userId, 120, "PROJECT_COMPLETED");
            addNotification(userId, "PROJECT_COMPLETED", "Project completed");
        }
        return loadProject(projectId);
    }

    @Transactional
    public Project updateProjectStatus(Long userId, Long projectId, ProjectStatus status) {
        Project project = findProject(userId, projectId);
        project.status().assertCanTransitionTo(status, completion(project.tasks()));
        projects.update(null, Wrappers.<ProjectPO>lambdaUpdate()
                .eq(ProjectPO::getId, projectId)
                .set(ProjectPO::getStatus, status.name()));
        if (status == ProjectStatus.COMPLETED) {
            addXp(userId, 120, "PROJECT_COMPLETED");
            addNotification(userId, "PROJECT_COMPLETED", "Project completed");
        }
        return loadProject(projectId);
    }

    public List<Project> listProjects(Long userId) {
        return projects.selectList(Wrappers.<ProjectPO>lambdaQuery()
                        .eq(ProjectPO::getUserId, userId)
                        .orderByAsc(ProjectPO::getCreatedAt))
                .stream().map(po -> loadProject(po.getId())).toList();
    }

    public Project getProject(Long userId, Long projectId) {
        return findProject(userId, projectId);
    }

    public void deleteProject(Long userId, Long projectId) {
        findProject(userId, projectId);
        projects.deleteById(projectId);
    }

    public CoachSession discussProject(Long userId, Long projectId) {
        Project project = findProject(userId, projectId);
        return createSession(userId, "Project: " + project.name(), "PROJECT");
    }

    @Transactional
    public CodeReview reviewSnippet(Long userId, String language, String code) {
        getUser(userId);
        if (code.getBytes().length > 204800) {
            throw new BusinessException(ErrorCode.CODE_TOO_LARGE, "Code snippet is too large");
        }
        String aiText = aiClient.chat("Review this code and return concise suggestions.", code);
        Long id = idGenerator.nextId();
        CodeReviewPO review = new CodeReviewPO();
        review.setId(id);
        review.setUserId(userId);
        review.setLanguage(language);
        review.setScore(86);
        review.setSuggestions(join(List.of("AI review: " + aiText)));
        reviews.insert(review);
        addXp(userId, 10, "CODE_REVIEW_CREATED");
        return toCodeReview(requireReview(id));
    }

    public List<CodeReview> listReviews(Long userId) {
        return reviews.selectList(Wrappers.<CodeReviewPO>lambdaQuery()
                        .eq(CodeReviewPO::getUserId, userId)
                        .orderByDesc(CodeReviewPO::getCreatedAt))
                .stream().map(this::toCodeReview).toList();
    }

    public CodeReview getReview(Long userId, Long reviewId) {
        CodeReviewPO review = reviews.selectOne(Wrappers.<CodeReviewPO>lambdaQuery()
                .eq(CodeReviewPO::getId, reviewId)
                .eq(CodeReviewPO::getUserId, userId));
        if (review == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Code review not found");
        }
        return toCodeReview(review);
    }

    public Growth getGrowth(Long userId) {
        GrowthPO po = growthRows.selectById(userId);
        if (po == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND, "Growth row not found");
        }
        return toGrowth(po);
    }

    public List<String> achievements(Long userId) {
        return getGrowth(userId).achievements();
    }

    public List<String> activityLog(Long userId) {
        return getGrowth(userId).activityLog();
    }

    public List<Notification> notifications(Long userId) {
        return notifications.selectList(Wrappers.<NotificationPO>lambdaQuery()
                        .eq(NotificationPO::getUserId, userId)
                        .orderByAsc(NotificationPO::getCreatedAt))
                .stream().map(this::toNotification).toList();
    }

    public long unreadNotifications(Long userId) {
        return notifications.selectCount(Wrappers.<NotificationPO>lambdaQuery()
                .eq(NotificationPO::getUserId, userId)
                .eq(NotificationPO::getRead, false));
    }

    public void markNotificationRead(Long userId, Long notificationId) {
        notifications.update(null, Wrappers.<NotificationPO>lambdaUpdate()
                .eq(NotificationPO::getUserId, userId)
                .eq(NotificationPO::getId, notificationId)
                .set(NotificationPO::getRead, true));
    }

    public void markAllNotificationsRead(Long userId) {
        notifications.update(null, Wrappers.<NotificationPO>lambdaUpdate()
                .eq(NotificationPO::getUserId, userId)
                .set(NotificationPO::getRead, true));
    }

    public LandingStats landingStats() {
        return new LandingStats(users.selectCount(null), projects.selectCount(null), messages.selectCount(null));
    }

    private Tokens issueTokens(Long userId) {
        String access = "acc_" + UUID.randomUUID();
        String refresh = "ref_" + UUID.randomUUID();
        redis.opsForValue().set(accessKey(access), userId.toString(), accessTokenTtl);
        redis.opsForValue().set(refreshKey(refresh), userId.toString(), refreshTokenTtl);
        return new Tokens(access, refresh, "Bearer", accessTokenTtl.toSeconds());
    }

    private Optional<UserAccount> findUserByEmail(String email) {
        UserPO user = users.selectOne(Wrappers.<UserPO>lambdaQuery().eq(UserPO::getEmail, email));
        return Optional.ofNullable(user).map(this::toUserAccount);
    }

    private Roadmap loadRoadmap(Long id) {
        RoadmapPO po = roadmaps.selectById(id);
        if (po == null) {
            throw new BusinessException(ErrorCode.ROADMAP_NOT_FOUND, "Roadmap not found");
        }
        Roadmap roadmap = toRoadmap(po);
        roadmap.tasks().addAll(roadmapTasks.selectList(Wrappers.<RoadmapTaskPO>lambdaQuery()
                        .eq(RoadmapTaskPO::getRoadmapId, id)
                        .orderByAsc(RoadmapTaskPO::getWeek))
                .stream().map(this::toRoadmapTask).toList());
        return roadmap;
    }

    private CoachSession loadSession(Long id) {
        CoachSessionPO po = sessions.selectById(id);
        if (po == null) {
            throw new BusinessException(ErrorCode.CHAT_SESSION_NOT_FOUND, "Chat session not found");
        }
        CoachSession session = toCoachSession(po);
        session.messages().addAll(messages.selectList(Wrappers.<ChatMessagePO>lambdaQuery()
                        .eq(ChatMessagePO::getSessionId, id)
                        .orderByAsc(ChatMessagePO::getCreatedAt))
                .stream().map(this::toChatMessage).toList());
        return session;
    }

    private CoachSession findSession(Long userId, Long sessionId) {
        CoachSessionPO po = sessions.selectOne(Wrappers.<CoachSessionPO>lambdaQuery()
                .eq(CoachSessionPO::getId, sessionId)
                .eq(CoachSessionPO::getUserId, userId));
        if (po == null) {
            throw new BusinessException(ErrorCode.CHAT_SESSION_NOT_FOUND, "Chat session not found");
        }
        return loadSession(sessionId);
    }

    private Project loadProject(Long id) {
        ProjectPO po = projects.selectById(id);
        if (po == null) {
            throw new BusinessException(ErrorCode.PROJECT_NOT_FOUND, "Project not found");
        }
        Project project = toProject(po);
        project.tasks().addAll(projectTasks.selectList(Wrappers.<ProjectTaskPO>lambdaQuery()
                        .eq(ProjectTaskPO::getProjectId, id))
                .stream().map(this::toProjectTask).toList());
        return project;
    }

    private Project findProject(Long userId, Long projectId) {
        ProjectPO po = projects.selectOne(Wrappers.<ProjectPO>lambdaQuery()
                .eq(ProjectPO::getId, projectId)
                .eq(ProjectPO::getUserId, userId));
        if (po == null) {
            throw new BusinessException(ErrorCode.PROJECT_NOT_FOUND, "Project not found");
        }
        return loadProject(projectId);
    }

    private CodeReviewPO requireReview(Long id) {
        CodeReviewPO po = reviews.selectById(id);
        if (po == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Code review not found");
        }
        return po;
    }

    private void insertMessage(Long sessionId, String role, String content) {
        ChatMessagePO message = new ChatMessagePO();
        message.setId(idGenerator.nextId());
        message.setSessionId(sessionId);
        message.setRole(role);
        message.setContent(content);
        messages.insert(message);
    }

    private void insertProjectTask(Long projectId, String title, boolean completed) {
        ProjectTaskPO task = new ProjectTaskPO();
        task.setId(idGenerator.nextId());
        task.setProjectId(projectId);
        task.setTitle(title);
        task.setCompleted(completed);
        projectTasks.insert(task);
    }

    private void addXp(Long userId, int amount, String reason) {
        Growth current = getGrowth(userId);
        int xp = current.xp() + amount;
        int level = xp / 100 + 1;
        List<String> achievements = new ArrayList<>(current.achievements());
        List<String> activityLog = new ArrayList<>(current.activityLog());
        activityLog.add(reason);
        if (xp >= 100 && !achievements.contains("LEVEL_2")) {
            achievements.add("LEVEL_2");
            addNotification(userId, "ACHIEVEMENT_UNLOCKED", "Level 2 unlocked");
        }
        GrowthPO update = new GrowthPO();
        update.setUserId(userId);
        update.setXp(xp);
        update.setLevel(level);
        update.setStreakDays(Math.max(1, current.streakDays()));
        update.setAchievements(join(achievements));
        update.setActivityLog(join(activityLog));
        growthRows.updateById(update);
    }

    private void addNotification(Long userId, String type, String message) {
        NotificationPO notification = new NotificationPO();
        notification.setId(idGenerator.nextId());
        notification.setUserId(userId);
        notification.setType(type);
        notification.setMessage(message);
        notification.setRead(false);
        notifications.insert(notification);
    }

    private int completion(List<ProjectTask> tasks) {
        return tasks.isEmpty() ? 0 : (int) Math.round(tasks.stream().filter(ProjectTask::completed).count() * 100.0 / tasks.size());
    }

    private String blankTo(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private String join(List<String> values) {
        return values == null ? "" : String.join("\n", values);
    }

    private List<String> split(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }
        return Arrays.asList(value.split("\\R"));
    }

    private String accessKey(String token) {
        return "auth:access:" + token;
    }

    private String refreshKey(String token) {
        return "auth:refresh:" + token;
    }

    private UserAccount toUserAccount(UserPO po) {
        return new UserAccount(po.getId(), po.getEmail(), po.getPasswordHash(), po.getDisplayName(),
                split(po.getSkills()), po.getGoal(), po.getWeeklyHours() == null ? 0 : po.getWeeklyHours());
    }

    private Growth toGrowth(GrowthPO po) {
        return new Growth(valueOrZero(po.getXp()), valueOrOne(po.getLevel()), valueOrZero(po.getStreakDays()),
                split(po.getAchievements()), split(po.getActivityLog()));
    }

    private Roadmap toRoadmap(RoadmapPO po) {
        return new Roadmap(po.getId(), po.getUserId(), po.getTargetRole(), valueOrZero(po.getWeeklyHours()),
                Boolean.TRUE.equals(po.getActive()), new ArrayList<>(), po.getCreatedAt());
    }

    private RoadmapTask toRoadmapTask(RoadmapTaskPO po) {
        return new RoadmapTask(po.getId(), valueOrZero(po.getWeek()), po.getTitle(), Boolean.TRUE.equals(po.getCompleted()));
    }

    private CoachSession toCoachSession(CoachSessionPO po) {
        return new CoachSession(po.getId(), po.getUserId(), po.getTitle(), po.getContextType(), new ArrayList<>());
    }

    private ChatMessage toChatMessage(ChatMessagePO po) {
        return new ChatMessage(po.getId(), po.getRole(), po.getContent(), po.getCreatedAt());
    }

    private Project toProject(ProjectPO po) {
        return new Project(po.getId(), po.getUserId(), po.getName(), po.getType(), ProjectStatus.valueOf(po.getStatus()), new ArrayList<>());
    }

    private ProjectTask toProjectTask(ProjectTaskPO po) {
        return new ProjectTask(po.getId(), po.getTitle(), Boolean.TRUE.equals(po.getCompleted()));
    }

    private CodeReview toCodeReview(CodeReviewPO po) {
        return new CodeReview(po.getId(), po.getUserId(), po.getLanguage(), valueOrZero(po.getScore()),
                split(po.getSuggestions()), po.getCreatedAt());
    }

    private Notification toNotification(NotificationPO po) {
        return new Notification(po.getId(), po.getType(), po.getMessage(), Boolean.TRUE.equals(po.getRead()), po.getCreatedAt());
    }

    private int valueOrZero(Integer value) {
        return value == null ? 0 : value;
    }

    private int valueOrOne(Integer value) {
        return value == null ? 1 : value;
    }

    public record Tokens(String accessToken, String refreshToken, String tokenType, long expiresInSeconds) {
    }

    public record LandingStats(long totalLearners, long totalProjects, long totalCoachMessages) {
    }

    public record UserAccount(@JsonSerialize(using = ToStringSerializer.class) Long id, String email,
                              @JsonIgnore String passwordHash, String displayName, List<String> skills,
                              String goal, int weeklyHours) {
    }

    public record RoadmapProgress(@JsonSerialize(using = ToStringSerializer.class) Long roadmapId,
                                  int totalTasks, int completedTasks, int completionPercent) {
    }

    public record Growth(int xp, int level, int streakDays, List<String> achievements, List<String> activityLog) {
    }

    public record Roadmap(@JsonSerialize(using = ToStringSerializer.class) Long id,
                          @JsonSerialize(using = ToStringSerializer.class) Long userId,
                          String targetRole, int weeklyHours, boolean active,
                          List<RoadmapTask> tasks, Instant createdAt) {
    }

    public record RoadmapTask(@JsonSerialize(using = ToStringSerializer.class) Long id, int week, String title, boolean completed) {
    }

    public record ChatMessage(@JsonSerialize(using = ToStringSerializer.class) Long id, String role, String content, Instant createdAt) {
    }

    public record CoachSession(@JsonSerialize(using = ToStringSerializer.class) Long id,
                               @JsonSerialize(using = ToStringSerializer.class) Long userId,
                               String title, String contextType, List<ChatMessage> messages) {
    }

    public record Project(@JsonSerialize(using = ToStringSerializer.class) Long id,
                          @JsonSerialize(using = ToStringSerializer.class) Long userId,
                          String name, String type, ProjectStatus status, List<ProjectTask> tasks) {
    }

    public record ProjectTask(@JsonSerialize(using = ToStringSerializer.class) Long id, String title, boolean completed) {
    }

    public record CodeReview(@JsonSerialize(using = ToStringSerializer.class) Long id,
                             @JsonSerialize(using = ToStringSerializer.class) Long userId,
                             String language, int score, List<String> suggestions, Instant createdAt) {
    }

    public record Notification(@JsonSerialize(using = ToStringSerializer.class) Long id,
                               String type, String message, boolean read, Instant createdAt) {
    }
}

