package com.mniu.aicamp.article.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;
import java.util.List;

public record Article(@JsonSerialize(using = ToStringSerializer.class) Long id,
                      String title,
                      String slug,
                      String summary,
                      String content,
                      String coverUrl,
                      String category,
                      List<String> tags,
                      Long authorId,
                      String status,
                      String targetAudience,
                      String difficulty,
                      Integer readMinutes,
                      long viewCount,
                      long likeCount,
                      String associatedType,
                      Long associatedId,
                      Instant publishedAt,
                      Instant createdAt) {
}
