package com.mniu.aicamp.article.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;

public record ArticleRead(@JsonSerialize(using = ToStringSerializer.class) Long id,
                          Long userId,
                          Long articleId,
                          double scrollRatio,
                          int readSeconds,
                          boolean completed,
                          Instant firstReadAt,
                          Instant lastReadAt) {
}
