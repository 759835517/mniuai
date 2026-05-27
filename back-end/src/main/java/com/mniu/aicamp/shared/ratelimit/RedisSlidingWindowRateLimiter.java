package com.mniu.aicamp.shared.ratelimit;

import org.springframework.stereotype.Component;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.time.Clock;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RedisSlidingWindowRateLimiter {
    private final Map<String, Deque<Long>> hits = new ConcurrentHashMap<>();
    private final Clock clock;
    private final StringRedisTemplate redis;

    public RedisSlidingWindowRateLimiter(StringRedisTemplate redis) {
        this(Clock.systemUTC(), redis);
    }

    public RedisSlidingWindowRateLimiter() {
        this(Clock.systemUTC(), null);
    }

    RedisSlidingWindowRateLimiter(Clock clock, StringRedisTemplate redis) {
        this.clock = clock;
        this.redis = redis;
    }

    public synchronized boolean allow(String key, int limit, long windowMillis) {
        long now = clock.millis();
        if (redis != null) {
            String redisKey = "rate-limit:" + key;
            redis.opsForZSet().removeRangeByScore(redisKey, 0, now - windowMillis);
            Long count = redis.opsForZSet().zCard(redisKey);
            if (count != null && count >= limit) {
                return false;
            }
            redis.opsForZSet().add(redisKey, UUID.randomUUID().toString(), now);
            redis.expire(redisKey, java.time.Duration.ofMillis(windowMillis));
            return true;
        }
        Deque<Long> queue = hits.computeIfAbsent(key, ignored -> new ArrayDeque<>());
        while (!queue.isEmpty() && queue.peekFirst() <= now - windowMillis) {
            queue.removeFirst();
        }
        if (queue.size() >= limit) {
            return false;
        }
        queue.addLast(now);
        return true;
    }
}
