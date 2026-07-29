package com.mniu.aicamp.article.application;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record ArticleCreateRequest(@NotBlank String title,
                                   String slug,
                                   String summary,
                                   @NotBlank String content,
                                   String coverUrl,
                                   String category,
                                   List<String> tags,
                                   String targetAudience,
                                   String difficulty,
                                   Integer readMinutes,
                                   String associatedType,
                                   Long associatedId) {
}
