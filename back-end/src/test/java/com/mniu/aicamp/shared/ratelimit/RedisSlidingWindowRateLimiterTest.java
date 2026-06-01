package com.mniu.aicamp.shared.ratelimit;

import org.junit.jupiter.api.Test;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class RedisSlidingWindowRateLimiterTest {
    @Test
    void rejectsRequestsAboveWindowLimit() {
        RedisSlidingWindowRateLimiter limiter = new RedisSlidingWindowRateLimiter();

        assertThat(limiter.allow("user-1", 2, 1000)).isTrue();
        assertThat(limiter.allow("user-1", 2, 1000)).isTrue();
        assertThat(limiter.allow("user-1", 2, 1000)).isFalse();
        assertThat(limiter.allow("user-2", 2, 1000)).isTrue();
    }

    @Test
    void redisBackedLimiterRecordsAllowedHitAndExpiresWindow() {
        StringRedisTemplate redis = mock(StringRedisTemplate.class);
        @SuppressWarnings("unchecked")
        ZSetOperations<String, String> zSet = mock(ZSetOperations.class);
        when(redis.opsForZSet()).thenReturn(zSet);
        when(zSet.zCard("rate-limit:user-1")).thenReturn(0L);
        RedisSlidingWindowRateLimiter limiter = new RedisSlidingWindowRateLimiter(redis);

        assertThat(limiter.allow("user-1", 2, 1000)).isTrue();

        verify(zSet).removeRangeByScore(eq("rate-limit:user-1"), eq(0.0), org.mockito.ArgumentMatchers.anyDouble());
        verify(zSet).add(eq("rate-limit:user-1"), anyString(), org.mockito.ArgumentMatchers.anyDouble());
        verify(redis).expire("rate-limit:user-1", Duration.ofMillis(1000));
    }

    @Test
    void redisBackedLimiterRejectsWhenWindowCountReached() {
        StringRedisTemplate redis = mock(StringRedisTemplate.class);
        @SuppressWarnings("unchecked")
        ZSetOperations<String, String> zSet = mock(ZSetOperations.class);
        when(redis.opsForZSet()).thenReturn(zSet);
        when(zSet.zCard("rate-limit:user-1")).thenReturn(2L);
        RedisSlidingWindowRateLimiter limiter = new RedisSlidingWindowRateLimiter(redis);

        assertThat(limiter.allow("user-1", 2, 1000)).isFalse();
    }
}
