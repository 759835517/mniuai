package com.mniu.aicamp.video.infrastructure.redis;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * 使用 Redis bitset 记录用户已观看的 5 秒分段。
 * key = video:watched:{userId}:{lessonId}, offset = positionSec / 5
 * setBit 返回写入前的值，false 表示该分段首次覆盖（应计 5 秒）。
 */
@Component
public class VideoWatchBitSet {
    private static final String PREFIX = "video:watched:";
    private static final int SEGMENT_SECONDS = 5;
    private static final Duration TTL = Duration.ofHours(2);

    private final StringRedisTemplate redis;

    public VideoWatchBitSet(StringRedisTemplate redis) {
        this.redis = redis;
    }

    /**
     * 标记分段为已观看。
     * @return true 表示该分段首次覆盖（应累加 valid_watched_sec）
     */
    public boolean markNewSegment(Long userId, Long lessonId, int positionSec) {
        long offset = positionSec / SEGMENT_SECONDS;
        String key = key(userId, lessonId);
        Boolean previous = redis.opsForValue().setBit(key, offset, true);
        redis.expire(key, TTL);
        return Boolean.FALSE.equals(previous);
    }

    private String key(Long userId, Long lessonId) {
        return PREFIX + userId + ":" + lessonId;
    }
}
