package com.mniu.aicamp.campus.application;

import java.util.List;

/**
 * 简历生成响应
 */
public record ResumeResponse(
        String markdownContent,
        List<ResumeSection> sections
) {
    public record ResumeSection(
            String title,
            String content
    ) {}
}
