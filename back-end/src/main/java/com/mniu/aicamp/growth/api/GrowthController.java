package com.mniu.aicamp.growth.api;

import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.api.PageResponse;
import com.mniu.aicamp.shared.security.CurrentUsers;
import com.mniu.aicamp.user.application.PlatformService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/growth")
public class GrowthController {
    private final PlatformService service;

    public GrowthController(PlatformService service) {
        this.service = service;
    }

    @GetMapping("/me")
    ApiResponse<PlatformService.Growth> me() {
        return ApiResponse.ok(service.getGrowth(CurrentUsers.require().id()));
    }

    @GetMapping("/profile")
    ApiResponse<PlatformService.Growth> profile() {
        return me();
    }

    @GetMapping("/achievements")
    ApiResponse<List<String>> achievements() {
        return ApiResponse.ok(service.achievements(CurrentUsers.require().id()));
    }

    @GetMapping("/activities")
    ApiResponse<?> activities(@RequestParam(required = false) Integer page,
                              @RequestParam(required = false) Integer size) {
        List<String> activities = service.activityLog(CurrentUsers.require().id());
        if (page == null && size == null) {
            return ApiResponse.ok(activities);
        }
        return ApiResponse.ok(PageResponse.of(activities, page == null ? 0 : page, size == null ? 20 : size));
    }

    @GetMapping("/stats")
    ApiResponse<Map<String, Object>> stats() {
        PlatformService.Growth growth = service.getGrowth(CurrentUsers.require().id());
        return ApiResponse.ok(Map.of(
                "xp", growth.xp(),
                "level", growth.level(),
                "activityCount", growth.activityLog().size(),
                "achievementCount", growth.achievements().size()
        ));
    }
}
