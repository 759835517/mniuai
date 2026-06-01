package com.mniu.aicamp.auth.api;

import com.mniu.aicamp.auth.application.AuthService;
import com.mniu.aicamp.shared.api.ApiResponse;
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
    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    ApiResponse<AuthService.Tokens> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.ok(service.register(request.email(), request.password(), request.displayName()));
    }

    @PostMapping("/login")
    ApiResponse<AuthService.Tokens> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok(service.login(request.email(), request.password()));
    }

    @PostMapping("/refresh")
    ApiResponse<AuthService.Tokens> refresh(@Valid @RequestBody RefreshRequest request) {
        return ApiResponse.ok(service.refresh(request.refreshToken()));
    }
}

record RegisterRequest(@Email @NotBlank String email, @Size(min = 8) String password, String displayName) {
}

record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {
}

record RefreshRequest(@NotBlank String refreshToken) {
}
