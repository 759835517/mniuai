package com.mniu.aicamp.user.api;

import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.security.CurrentUsers;
import com.mniu.aicamp.user.application.UserAccount;
import com.mniu.aicamp.user.application.UserAccountService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users/me")
public class UserController {
    private final UserAccountService service;

    public UserController(UserAccountService service) {
        this.service = service;
    }

    @GetMapping
    ApiResponse<UserAccount> me() {
        return ApiResponse.ok(service.getUser(CurrentUsers.require().id()));
    }

    @PutMapping("/profile")
    ApiResponse<UserAccount> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.ok(service.updateProfile(CurrentUsers.require().id(), request.displayName(), request.goal(), request.weeklyHours()));
    }

    @PutMapping
    ApiResponse<UserAccount> updateMe(@Valid @RequestBody UpdateProfileRequest request) {
        return updateProfile(request);
    }

    @PutMapping("/skills")
    ApiResponse<UserAccount> updateSkills(@Valid @RequestBody UpdateSkillsRequest request) {
        return ApiResponse.ok(service.updateSkills(CurrentUsers.require().id(), request.skills()));
    }
}

record UpdateProfileRequest(String displayName, String goal, @Min(0) @Max(80) Integer weeklyHours) {
}

record UpdateSkillsRequest(List<String> skills) {
    UpdateSkillsRequest {
        skills = skills == null ? List.of() : skills;
    }
}
