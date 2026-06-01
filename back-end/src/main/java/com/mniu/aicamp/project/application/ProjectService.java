package com.mniu.aicamp.project.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.fasterxml.jackson.databind.JsonNode;
import com.mniu.aicamp.coach.application.CoachService;
import com.mniu.aicamp.coach.application.CoachSession;
import com.mniu.aicamp.growth.application.GrowthService;
import com.mniu.aicamp.notification.application.NotificationService;
import com.mniu.aicamp.project.domain.ProjectStatus;
import com.mniu.aicamp.project.infrastructure.mapper.ProjectMapper;
import com.mniu.aicamp.project.infrastructure.mapper.ProjectTaskMapper;
import com.mniu.aicamp.project.infrastructure.po.ProjectPO;
import com.mniu.aicamp.project.infrastructure.po.ProjectTaskPO;
import com.mniu.aicamp.shared.ai.AiClientPort;
import com.mniu.aicamp.shared.ai.AiJsonExtractor;
import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import com.mniu.aicamp.user.infrastructure.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {
    private final AiClientPort aiClient;
    private final AiJsonExtractor aiJsonExtractor;
    private final CoachService coachService;
    private final GrowthService growthService;
    private final NotificationService notificationService;
    private final SnowflakeIdGenerator idGenerator;
    private final UserMapper users;
    private final ProjectMapper projects;
    private final ProjectTaskMapper projectTasks;

    public ProjectService(AiClientPort aiClient,
                          AiJsonExtractor aiJsonExtractor,
                          CoachService coachService,
                          GrowthService growthService,
                          NotificationService notificationService,
                          SnowflakeIdGenerator idGenerator,
                          UserMapper users,
                          ProjectMapper projects,
                          ProjectTaskMapper projectTasks) {
        this.aiClient = aiClient;
        this.aiJsonExtractor = aiJsonExtractor;
        this.coachService = coachService;
        this.growthService = growthService;
        this.notificationService = notificationService;
        this.idGenerator = idGenerator;
        this.users = users;
        this.projects = projects;
        this.projectTasks = projectTasks;
    }

    @Transactional
    public Project createProject(Long userId, String name, String type) {
        requireUser(userId);
        Long id = idGenerator.nextId();
        ProjectPO project = new ProjectPO();
        project.setId(id);
        project.setUserId(userId);
        project.setName(name);
        project.setType(type);
        project.setStatus(ProjectStatus.ACTIVE.name());
        projects.insert(project);
        for (GeneratedProjectTask task : generateProjectTasks(name, type)) {
            insertProjectTask(id, task.title(), task.completed());
        }
        growthService.addXp(userId, 15, "PROJECT_CREATED");
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
            growthService.addXp(userId, 120, "PROJECT_COMPLETED");
            notificationService.addNotification(userId, "PROJECT_COMPLETED", "Project completed");
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
            growthService.addXp(userId, 120, "PROJECT_COMPLETED");
            notificationService.addNotification(userId, "PROJECT_COMPLETED", "Project completed");
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
        return coachService.createSession(userId, "Project: " + project.name(), "PROJECT");
    }

    public long totalProjects() {
        return projects.selectCount(null);
    }

    private void requireUser(Long userId) {
        if (users.selectById(userId) == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND, "User not found");
        }
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

    private void insertProjectTask(Long projectId, String title, boolean completed) {
        ProjectTaskPO task = new ProjectTaskPO();
        task.setId(idGenerator.nextId());
        task.setProjectId(projectId);
        task.setTitle(title);
        task.setCompleted(completed);
        projectTasks.insert(task);
    }

    private List<GeneratedProjectTask> generateProjectTasks(String name, String type) {
        try {
            String prompt = "Generate a project plan for name=" + name + ", type=" + type
                    + ". Return JSON with tasks array, each item has title and completed.";
            JsonNode tasks = aiJsonExtractor.extract(aiClient.chat("PROJECT_PLAN_JSON", prompt)).path("tasks");
            List<GeneratedProjectTask> generated = new ArrayList<>();
            if (tasks.isArray()) {
                for (JsonNode task : tasks) {
                    String title = task.path("title").asText("");
                    if (!title.isBlank()) {
                        generated.add(new GeneratedProjectTask(title, task.path("completed").asBoolean(false)));
                    }
                }
            }
            if (!generated.isEmpty()) {
                return generated;
            }
        } catch (BusinessException ignored) {
            // Fall back to deterministic MVP tasks when AI JSON is unavailable.
        }
        return List.of(
                new GeneratedProjectTask("Define scope", true),
                new GeneratedProjectTask("Build first vertical slice", false),
                new GeneratedProjectTask("Add tests and polish", false)
        );
    }

    private int completion(List<ProjectTask> tasks) {
        return tasks.isEmpty() ? 0 : (int) Math.round(tasks.stream().filter(ProjectTask::completed).count() * 100.0 / tasks.size());
    }

    private Project toProject(ProjectPO po) {
        return new Project(po.getId(), po.getUserId(), po.getName(), po.getType(), ProjectStatus.valueOf(po.getStatus()), new ArrayList<>());
    }

    private ProjectTask toProjectTask(ProjectTaskPO po) {
        return new ProjectTask(po.getId(), po.getTitle(), Boolean.TRUE.equals(po.getCompleted()));
    }

    private record GeneratedProjectTask(String title, boolean completed) {
    }
}
