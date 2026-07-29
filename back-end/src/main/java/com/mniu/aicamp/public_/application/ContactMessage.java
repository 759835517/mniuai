package com.mniu.aicamp.public_.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;

/**
 * 联系消息记录（存储到数据库）
 */
public record ContactMessage(@JsonSerialize(using = ToStringSerializer.class) Long id,
                              String name,
                              String email,
                              String type,
                              String message,
                              String status,
                              Instant createdAt) {
}
