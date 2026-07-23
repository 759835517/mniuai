package com.mniu.aicamp.roadmap.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.fasterxml.jackson.databind.JsonNode;
import com.mniu.aicamp.growth.application.GrowthService;
import com.mniu.aicamp.notification.application.NotificationService;
import com.mniu.aicamp.roadmap.infrastructure.mapper.RoadmapMapper;
import com.mniu.aicamp.roadmap.infrastructure.mapper.RoadmapTaskMapper;
import com.mniu.aicamp.roadmap.infrastructure.po.RoadmapPO;
import com.mniu.aicamp.roadmap.infrastructure.po.RoadmapTaskPO;
import com.mniu.aicamp.shared.ai.AiClientPort;
import com.mniu.aicamp.shared.ai.AiJsonExtractor;
import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import com.mniu.aicamp.user.infrastructure.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Locale;
import java.util.List;

@Service
public class RoadmapService {
    private final AiClientPort aiClient;
    private final AiJsonExtractor aiJsonExtractor;
    private final GrowthService growthService;
    private final NotificationService notificationService;
    private final SnowflakeIdGenerator idGenerator;
    private final UserMapper users;
    private final RoadmapMapper roadmaps;
    private final RoadmapTaskMapper roadmapTasks;

    public RoadmapService(AiClientPort aiClient,
                          AiJsonExtractor aiJsonExtractor,
                          GrowthService growthService,
                          NotificationService notificationService,
                          SnowflakeIdGenerator idGenerator,
                          UserMapper users,
                          RoadmapMapper roadmaps,
                          RoadmapTaskMapper roadmapTasks) {
        this.aiClient = aiClient;
        this.aiJsonExtractor = aiJsonExtractor;
        this.growthService = growthService;
        this.notificationService = notificationService;
        this.idGenerator = idGenerator;
        this.users = users;
        this.roadmaps = roadmaps;
        this.roadmapTasks = roadmapTasks;
    }

    @Transactional
    public Roadmap generateRoadmap(Long userId, String targetRole, int weeklyHours, int durationWeeks) {
        requireUser(userId);
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
        for (GeneratedTask generatedTask : generateRoadmapTasks(targetRole, weeklyHours, durationWeeks)) {
            RoadmapTaskPO task = new RoadmapTaskPO();
            task.setId(idGenerator.nextId());
            task.setRoadmapId(roadmapId);
            task.setWeek(generatedTask.week());
            task.setTitle(generatedTask.title());
            task.setCompleted(false);
            roadmapTasks.insert(task);
        }
        growthService.addXp(userId, 20, "ROADMAP_GENERATED");
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
        return new RoadmapProgress(roadmap.id(), roadmap.tasks().size(), (int) completed, percent, progressItems(roadmap));
    }

    @Transactional
    public Roadmap updateRoadmapTask(Long userId, Long taskId, boolean completed) {
        Roadmap roadmap = activeRoadmap(userId);
        return updateRoadmapTask(userId, roadmap.id(), taskId, completed);
    }

    @Transactional
    public Roadmap updateRoadmapTask(Long userId, Long roadmapId, Long taskId, boolean completed) {
        Roadmap roadmap = getRoadmap(userId, roadmapId);
        RoadmapTask task = roadmap.tasks().stream().filter(t -> t.id().equals(taskId)).findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.ROADMAP_TASK_NOT_FOUND, "Roadmap task not found"));
        roadmapTasks.update(null, Wrappers.<RoadmapTaskPO>lambdaUpdate()
                .eq(RoadmapTaskPO::getId, taskId)
                .eq(RoadmapTaskPO::getRoadmapId, roadmapId)
                .set(RoadmapTaskPO::getCompleted, completed));
        if (!task.completed() && completed) {
            growthService.addXp(userId, 30, "ROADMAP_TASK_COMPLETED");
            notificationService.addNotification(userId, "XP_GAINED", "Roadmap task completed");
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
            growthService.addXp(userId, 30, "ROADMAP_TASK_COMPLETED");
            notificationService.addNotification(userId, "XP_GAINED", "Roadmap task completed");
        }
        return roadmapProgress(userId, roadmapId);
    }

    @Transactional
    public RoadmapProgress applyLearningEvidence(Long userId, String evidenceType, String topic, int score) {
        Roadmap roadmap;
        try {
            roadmap = activeRoadmap(userId);
        } catch (BusinessException ex) {
            return new RoadmapProgress(null, 0, 0, 0, List.of());
        }
        if (score < 80) {
            return roadmapProgress(userId, roadmap.id());
        }
        List<RoadmapTask> matchedTasks = roadmap.tasks().stream()
                .filter(task -> !task.completed())
                .filter(task -> evidenceMatchesTask(evidenceType, topic, task.title()))
                .toList();
        for (RoadmapTask task : matchedTasks) {
            roadmapTasks.update(null, Wrappers.<RoadmapTaskPO>lambdaUpdate()
                    .eq(RoadmapTaskPO::getId, task.id())
                    .eq(RoadmapTaskPO::getRoadmapId, roadmap.id())
                    .set(RoadmapTaskPO::getCompleted, true));
            growthService.addXp(userId, 30, "ROADMAP_TASK_AUTO_COMPLETED");
            notificationService.addNotification(userId, "XP_GAINED", "Roadmap task auto-completed by " + evidenceType);
        }
        return roadmapProgress(userId, roadmap.id());
    }

    private void requireUser(Long userId) {
        if (users.selectById(userId) == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND, "User not found");
        }
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

    private List<GeneratedTask> generateRoadmapTasks(String targetRole, int weeklyHours, int durationWeeks) {
        try {
            String prompt = "Generate a learning roadmap for targetRole=" + targetRole
                    + ", weeklyHours=" + weeklyHours + ", durationWeeks=" + durationWeeks
                    + ". Return JSON with tasks array, each item has week and title.";
            JsonNode tasks = aiJsonExtractor.extract(aiClient.chat("ROADMAP_JSON", prompt)).path("tasks");
            List<GeneratedTask> generated = new ArrayList<>();
            if (tasks.isArray()) {
                int fallbackWeek = 1;
                for (JsonNode task : tasks) {
                    String title = task.path("title").asText("");
                    if (!title.isBlank()) {
                        generated.add(new GeneratedTask(Math.max(1, task.path("week").asInt(fallbackWeek)), title));
                    }
                    fallbackWeek++;
                }
            }
            if (!generated.isEmpty()) {
                return generated;
            }
        } catch (BusinessException ignored) {
            // Fall back to deterministic MVP tasks when AI JSON is unavailable.
        }
        List<GeneratedTask> fallback = new ArrayList<>();
        for (int week = 1; week <= Math.max(1, durationWeeks); week++) {
            fallback.add(new GeneratedTask(week, "Week " + week + " " + targetRole + " practice"));
        }
        return fallback;
    }

    private Roadmap toRoadmap(RoadmapPO po) {
        return new Roadmap(po.getId(), po.getUserId(), po.getTargetRole(), valueOrZero(po.getWeeklyHours()),
                Boolean.TRUE.equals(po.getActive()), new ArrayList<>(), po.getCreatedAt());
    }

    private RoadmapTask toRoadmapTask(RoadmapTaskPO po) {
        return new RoadmapTask(po.getId(), valueOrZero(po.getWeek()), po.getTitle(), Boolean.TRUE.equals(po.getCompleted()));
    }

    private List<RoadmapProgress.RoadmapProgressItem> progressItems(Roadmap roadmap) {
        List<RoadmapProgress.RoadmapProgressItem> items = new ArrayList<>();
        int currentWeek = Integer.MIN_VALUE;
        int taskIndex = 0;
        for (RoadmapTask task : roadmap.tasks()) {
            if (task.week() != currentWeek) {
                currentWeek = task.week();
                taskIndex = 0;
            }
            items.add(new RoadmapProgress.RoadmapProgressItem(
                    task.week(),
                    taskIndex,
                    task.completed() ? "COMPLETED" : "NOT_STARTED",
                    task.completed() ? Instant.now() : null));
            taskIndex++;
        }
        return items;
    }

    private String blankTo(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private boolean evidenceMatchesTask(String evidenceType, String topic, String taskTitle) {
        String evidence = normalize(evidenceType + " " + topic);
        String title = normalize(taskTitle);
        if (evidence.isBlank() || title.isBlank()) {
            return false;
        }
        if (containsAny(evidence, "review", "code", "repository", "repo", "审查", "代码", "仓库")
                && containsAny(title, "review", "code", "repository", "repo", "test", "审查", "代码", "仓库", "测试")) {
            return true;
        }
        for (String token : evidence.split("\\s+")) {
            if (token.length() >= 3 && title.contains(token)) {
                return true;
            }
        }
        return false;
    }

    private boolean containsAny(String value, String... terms) {
        for (String term : terms) {
            if (value.contains(term.toLowerCase(Locale.ROOT))) {
                return true;
            }
        }
        return false;
    }

    private String normalize(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT).replaceAll("[^\\p{IsHan}\\p{Alnum}]+", " ").trim();
    }

    private int valueOrZero(Integer value) {
        return value == null ? 0 : value;
    }

    private record GeneratedTask(int week, String title) {
    }
}
