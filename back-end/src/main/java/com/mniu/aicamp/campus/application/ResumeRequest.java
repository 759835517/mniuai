package com.mniu.aicamp.campus.application;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

/**
 * 简历生成请求
 */
public record ResumeRequest(
        @NotBlank(message = "姓名不能为空") String name,
        String school,
        String major,
        String graduationDate,
        String email,
        String phone,
        String github,
        String bio,
        List<String> skills,
        List<ProjectExperience> projects,
        List<String> experiences
) {
    public record ProjectExperience(
            String name,
            String role,
            String description,
            List<String> techStack
    ) {}
}
