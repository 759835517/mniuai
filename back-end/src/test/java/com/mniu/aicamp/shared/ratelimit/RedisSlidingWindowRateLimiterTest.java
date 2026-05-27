package com.mniu.aicamp.shared.ratelimit;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class RedisSlidingWindowRateLimiterTest {
    @Test
    void rejectsRequestsAboveWindowLimit() {
        RedisSlidingWindowRateLimiter limiter = new RedisSlidingWindowRateLimiter();

        assertThat(limiter.allow("user-1", 2, 1000)).isTrue();
        assertThat(limiter.allow("user-1", 2, 1000)).isTrue();
        assertThat(limiter.allow("user-1", 2, 1000)).isFalse();
        assertThat(limiter.allow("user-2", 2, 1000)).isTrue();
    }
}
