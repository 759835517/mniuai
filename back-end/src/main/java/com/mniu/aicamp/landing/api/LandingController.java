package com.mniu.aicamp.landing.api;

import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.user.application.PlatformService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/landing")
public class LandingController {
    private final PlatformService service;

    public LandingController(PlatformService service) {
        this.service = service;
    }

    @GetMapping("/stats")
    ApiResponse<PlatformService.LandingStats> stats() {
        return ApiResponse.ok(service.landingStats());
    }
}
