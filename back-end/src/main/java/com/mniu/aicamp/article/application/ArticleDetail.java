package com.mniu.aicamp.article.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;
import java.util.List;

public record ArticleDetail(@JsonSerialize(using = ToStringSerializer.class) Long id,
                            String title,
                            String slug,
                            String summary,
                            String content,
                            String coverUrl,
                            String category,
                            List<String> tags,
                            String authorName,
                            String targetAudience,
                            String difficulty,
                            int readMinutes,
                            long viewCount,
                            long likeCount,
                            Instant publishedAt,
                            Instant createdAt) {
}
