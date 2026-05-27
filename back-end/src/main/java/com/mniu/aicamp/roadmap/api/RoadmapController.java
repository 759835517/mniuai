package com.mniu.aicamp.roadmap.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.api.PageResponse;
import com.mniu.aicamp.shared.security.CurrentUsers;
import com.mniu.aicamp.user.application.PlatformService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/roadmaps")
public class RoadmapController {
    private final PlatformService service;

    public RoadmapController(PlatformService service) {
        this.service = service;
    }

    @PostMapping
    ApiResponse<PlatformService.Roadmap> generate(@Valid @RequestBody RoadmapGenerateRequest request) {
        return ApiResponse.ok(service.generateRoadmap(CurrentUsers.require().id(), request.resolvedTargetRole(),
                request.resolvedWeeklyHours(), request.resolvedDurationWeeks()));
    }

    @PostMapping("/generate")
    ApiResponse<PlatformService.Roadmap> generateFromFrontend(@Valid @RequestBody RoadmapGenerateRequest request) {
        return generate(request);
    }

    @GetMapping
    ApiResponse<List<PlatformService.Roadmap>> list() {
        return ApiResponse.ok(service.listRoadmaps(CurrentUsers.require().id()));
    }

    @GetMapping("/history")
    ApiResponse<PageResponse<PlatformService.Roadmap>> history(@RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(PageResponse.of(service.listRoadmaps(CurrentUsers.require().id()), page, size));
    }

    @GetMapping("/active")
    ApiResponse<PlatformService.Roadmap> active() {
        return ApiResponse.ok(service.activeRoadmap(CurrentUsers.require().id()));
    }

    @GetMapping("/{roadmapId}")
    ApiResponse<PlatformService.Roadmap> detail(@PathVariable Long roadmapId) {
        return ApiResponse.ok(service.getRoadmap(CurrentUsers.require().id(), roadmapId));
    }

    @GetMapping("/{roadmapId}/progress")
    ApiResponse<PlatformService.RoadmapProgress> progress(@PathVariable Long roadmapId) {
        return ApiResponse.ok(service.roadmapProgress(CurrentUsers.require().id(), roadmapId));
    }

    @PutMapping("/{roadmapId}/active")
    ApiResponse<PlatformService.Roadmap> activate(@PathVariable Long roadmapId) {
        return ApiResponse.ok(service.activateRoadmap(CurrentUsers.require().id(), roadmapId));
    }

    @PatchMapping("/{roadmapId}/activate")
    ApiResponse<Map<String, Object>> activateFrontend(@PathVariable Long roadmapId) {
        PlatformService.Roadmap roadmap = service.activateRoadmap(CurrentUsers.require().id(), roadmapId);
        return ApiResponse.ok(Map.of("id", String.valueOf(roadmap.id()), "isActive", roadmap.active()));
    }

    @PostMapping("/{roadmapId}/regenerate")
    ApiResponse<PlatformService.Roadmap> regenerate(@PathVariable Long roadmapId,
                                                    @RequestBody(required = false) RoadmapRegenerateRequest request) {
        RoadmapRegenerateRequest body = request == null ? new RoadmapRegenerateRequest(null, null, null) : request;
        return ApiResponse.ok(service.regenerateRoadmap(CurrentUsers.require().id(), roadmapId,
                body.targetRole(), body.weeklyHours(), body.durationWeeks()));
    }

    @PutMapping("/tasks/{taskId}")
    ApiResponse<PlatformService.Roadmap> updateTask(@PathVariable Long taskId, @RequestBody UpdateProgressRequest request) {
        return ApiResponse.ok(service.updateRoadmapTask(CurrentUsers.require().id(), taskId, request.completed()));
    }

    @PutMapping("/{roadmapId}/progress")
    ApiResponse<PlatformService.RoadmapProgress> updateProgress(@PathVariable Long roadmapId,
                                                                @RequestBody UpdateRoadmapProgressRequest request) {
        return ApiResponse.ok(service.updateRoadmapProgress(CurrentUsers.require().id(), roadmapId,
                request.weekNumber(), request.taskIndex(), request.status()));
    }
}

record RoadmapGenerateRequest(String targetRole,
                              @Min(1) @Max(80) Integer weeklyHours,
                              @Min(1) @Max(24) Integer durationWeeks,
                              List<String> currentSkills,
                              Object learningGoal,
                              Integer availableHoursPerWeek) {
    String resolvedTargetRole() {
        if (targetRole != null && !targetRole.isBlank()) {
            return targetRole;
        }
        return learningGoal == null ? "AI Engineer" : learningGoal.toString();
    }

    int resolvedWeeklyHours() {
        return weeklyHours == null ? Math.max(1, availableHoursPerWeek == null ? 10 : availableHoursPerWeek) : weeklyHours;
    }

    int resolvedDurationWeeks() {
        return durationWeeks == null ? 4 : durationWeeks;
    }
}

record UpdateProgressRequest(boolean completed) {
}

record UpdateRoadmapProgressRequest(@JsonProperty("week_number") int weekNumber,
                                    @JsonProperty("task_index") int taskIndex,
                                    String status) {
}

record RoadmapRegenerateRequest(String targetRole, Integer weeklyHours, Integer durationWeeks) {
}

