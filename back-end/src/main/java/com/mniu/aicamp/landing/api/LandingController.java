package com.mniu.aicamp.landing.api;

import com.mniu.aicamp.landing.application.LandingService;
import com.mniu.aicamp.shared.api.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/landing")
public class LandingController {
    private final LandingService service;

    public LandingController(LandingService service) {
        this.service = service;
    }

    @GetMapping("/stats")
    ApiResponse<LandingService.LandingStats> stats() {
        return ApiResponse.ok(service.landingStats());
    }
}
