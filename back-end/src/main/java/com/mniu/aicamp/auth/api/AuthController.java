package com.mniu.aicamp.auth.api;

import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.user.application.PlatformService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final PlatformService service;

    public AuthController(PlatformService service) {
        this.service = service;
    }

    @PostMapping("/register")
    ApiResponse<PlatformService.Tokens> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.ok(service.register(request.email(), request.password(), request.displayName()));
    }

    @PostMapping("/login")
    ApiResponse<PlatformService.Tokens> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok(service.login(request.email(), request.password()));
    }

    @PostMapping("/refresh")
    ApiResponse<PlatformService.Tokens> refresh(@Valid @RequestBody RefreshRequest request) {
        return ApiResponse.ok(service.refresh(request.refreshToken()));
    }
}

record RegisterRequest(@Email @NotBlank String email, @Size(min = 8) String password, String displayName) {
}

record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {
}

record RefreshRequest(@NotBlank String refreshToken) {
}
