package com.mniu.aicamp.project.api;

import com.mniu.aicamp.project.domain.ProjectStatus;
import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.api.PageResponse;
import com.mniu.aicamp.shared.security.CurrentUsers;
import com.mniu.aicamp.user.application.PlatformService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {
    private final PlatformService service;

    public ProjectController(PlatformService service) {
        this.service = service;
    }

    @PostMapping
    ApiResponse<PlatformService.Project> create(@Valid @RequestBody CreateProjectRequest request) {
        return ApiResponse.ok(service.createProject(CurrentUsers.require().id(), request.resolvedName(), request.type()));
    }

    @GetMapping
    ApiResponse<?> list(@RequestParam(required = false) Integer page, @RequestParam(required = false) Integer size) {
        List<PlatformService.Project> projects = service.listProjects(CurrentUsers.require().id());
        if (page == null && size == null) {
            return ApiResponse.ok(projects);
        }
        return ApiResponse.ok(PageResponse.of(projects, page == null ? 0 : page, size == null ? 20 : size));
    }

    @GetMapping("/{projectId}")
    ApiResponse<PlatformService.Project> detail(@PathVariable Long projectId) {
        return ApiResponse.ok(service.getProject(CurrentUsers.require().id(), projectId));
    }

    @PostMapping("/{projectId}/discuss")
    ApiResponse<Map<String, Object>> discuss(@PathVariable Long projectId) {
        PlatformService.CoachSession session = service.discussProject(CurrentUsers.require().id(), projectId);
        return ApiResponse.ok(Map.of("sessionId", String.valueOf(session.id()), "redirectUrl", "/coach/" + session.id(),
                "contextType", session.contextType()));
    }

    @PutMapping("/{projectId}/tasks/{taskId}")
    ApiResponse<PlatformService.Project> updateTask(@PathVariable Long projectId, @PathVariable Long taskId, @RequestBody UpdateTaskRequest request) {
        return ApiResponse.ok(service.updateProjectTask(CurrentUsers.require().id(), projectId, taskId, request.completed()));
    }

    @PatchMapping("/{projectId}/tasks/{taskId}")
    ApiResponse<Map<String, Object>> patchTask(@PathVariable Long projectId, @PathVariable Long taskId, @RequestBody UpdateTaskRequest request) {
        PlatformService.Project project = service.updateProjectTask(CurrentUsers.require().id(), projectId, taskId, request.completed());
        long completed = project.tasks().stream().filter(PlatformService.ProjectTask::completed).count();
        int completionRate = project.tasks().isEmpty() ? 0 : (int) Math.round(completed * 100.0 / project.tasks().size());
        return ApiResponse.ok(Map.of("taskId", String.valueOf(taskId), "completed", request.completed(),
                "completedAt", Instant.now(), "projectCompletionRate", completionRate));
    }

    @PutMapping("/{projectId}/status")
    ApiResponse<PlatformService.Project> updateStatus(@PathVariable Long projectId, @RequestBody UpdateStatusRequest request) {
        return ApiResponse.ok(service.updateProjectStatus(CurrentUsers.require().id(), projectId, request.status()));
    }

    @PatchMapping("/{projectId}")
    ApiResponse<PlatformService.Project> updateProject(@PathVariable Long projectId, @RequestBody UpdateProjectRequest request) {
        return ApiResponse.ok(service.updateProject(CurrentUsers.require().id(), projectId,
                request.resolvedName(), request.status()));
    }

    @DeleteMapping("/{projectId}")
    ApiResponse<Map<String, Boolean>> deleteProject(@PathVariable Long projectId) {
        service.deleteProject(CurrentUsers.require().id(), projectId);
        return ApiResponse.ok(Map.of("deleted", true));
    }
}

record CreateProjectRequest(String name, String projectName, String type, String description) {
    String resolvedName() {
        if (name != null && !name.isBlank()) {
            return name;
        }
        return projectName == null || projectName.isBlank() ? type + " Project" : projectName;
    }
}

record UpdateTaskRequest(boolean completed) {
}

record UpdateStatusRequest(ProjectStatus status) {
}

record UpdateProjectRequest(String name, String projectName, String description, ProjectStatus status) {
    String resolvedName() {
        if (name != null && !name.isBlank()) {
            return name;
        }
        return projectName;
    }
}

