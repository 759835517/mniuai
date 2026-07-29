package com.mniu.aicamp.video.infrastructure.redis;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * 同 user+lesson 同秒仅接受 1 次心跳。
 * key = video:dedup:{userId}:{lessonId}:{positionSec}
 * SET NX EX 2 实现去重。
 */
@Component
public class HeartbeatDedup {
    private static final String PREFIX = "video:dedup:";
    private static final Duration TTL = Duration.ofSeconds(2);

    private final StringRedisTemplate redis;

    public HeartbeatDedup(StringRedisTemplate redis) {
        this.redis = redis;
    }

    /**
     * @return true 表示该位置首次心跳（应处理），false 表示重复（应丢弃）
     */
    public boolean tryAcquire(Long userId, Long lessonId, int positionSec) {
        String key = PREFIX + userId + ":" + lessonId + ":" + positionSec;
        Boolean success = redis.opsForValue().setIfAbsent(key, "1", TTL);
        return Boolean.TRUE.equals(success);
    }
}
