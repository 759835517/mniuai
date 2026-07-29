package com.mniu.aicamp.video.infrastructure.redis;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * 心跳会话状态暂存。
 * key = video:session:{userId}:{lessonId}
 * 存储 lastPositionSec / accumulatedValidSec / lastHeartbeatEpoch
 */
@Component
public class VideoSessionStore {
    private static final String PREFIX = "video:session:";
    private static final Duration TTL = Duration.ofMinutes(5);

    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper;

    public VideoSessionStore(StringRedisTemplate redis, ObjectMapper objectMapper) {
        this.redis = redis;
        this.objectMapper = objectMapper;
    }

    public HeartbeatSession get(Long userId, Long lessonId) {
        String value = redis.opsForValue().get(key(userId, lessonId));
        if (value == null) {
            return null;
        }
        try {
            return objectMapper.readValue(value, HeartbeatSession.class);
        } catch (Exception e) {
            return null;
        }
    }

    public void put(Long userId, Long lessonId, HeartbeatSession session) {
        try {
            String value = objectMapper.writeValueAsString(session);
            redis.opsForValue().set(key(userId, lessonId), value, TTL);
        } catch (Exception ignored) {
            // 序列化失败不影响主流程
        }
    }

    private String key(Long userId, Long lessonId) {
        return PREFIX + userId + ":" + lessonId;
    }
}
