package com.mniu.aicamp.interview.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;
import java.util.List;

public record InterviewQuestion(@JsonSerialize(using = ToStringSerializer.class) Long id,
                                String category,
                                String subCategory,
                                String difficulty,
                                String title,
                                String content,
                                List<String> keyPoints,
                                List<String> companies,
                                List<String> tags,
                                String source,
                                String status,
                                long viewCount,
                                Instant createdAt) {
}
