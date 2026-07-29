package com.mniu.aicamp.video.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * AntiCheatEngine 单元测试：覆盖 5 种防作弊场景。
 */
class AntiCheatEngineTest {
    private AntiCheatEngine engine;
    private Instant baseTime;

    @BeforeEach
    void setUp() {
        engine = new AntiCheatEngine();
        baseTime = Instant.now();
    }

    @Test
    void normalPlayback_returnsDelta() {
        // 正常播放：10 秒内前进 10 秒 → 计 10 秒
        HeartbeatContext ctx = new HeartbeatContext(10, 1.0, 0, 0, baseTime, baseTime.plusSeconds(10));
        assertThat(engine.evaluate(ctx)).isEqualTo(10);
    }

    @Test
    void speedAbove2_returnsZero() {
        // 倍速 2.5x → 不计
        HeartbeatContext ctx = new HeartbeatContext(25, 2.5, 0, 0, baseTime, baseTime.plusSeconds(10));
        assertThat(engine.evaluate(ctx)).isEqualTo(0);
    }

    @Test
    void jumpOver30Seconds_returnsElapsedOnly() {
        // 跳跃 60 秒但实际仅过 10 秒 → 仅计 10 秒（不超过 elapsed）
        HeartbeatContext ctx = new HeartbeatContext(60, 1.0, 0, 0, baseTime, baseTime.plusSeconds(10));
        assertThat(engine.evaluate(ctx)).isEqualTo(10);
    }

    @Test
    void noHeartbeatOver60Seconds_returnsZero() {
        // 61 秒无心跳 → 暂停，本次不计
        HeartbeatContext ctx = new HeartbeatContext(70, 1.0, 0, 0, baseTime, baseTime.plusSeconds(61));
        assertThat(engine.evaluate(ctx)).isEqualTo(0);
    }

    @Test
    void backwardSeek_returnsZero() {
        // 后退 → 不计
        HeartbeatContext ctx = new HeartbeatContext(5, 1.0, 10, 0, baseTime, baseTime.plusSeconds(5));
        assertThat(engine.evaluate(ctx)).isEqualTo(0);
    }

    @Test
    void deltaExceedsElapsed_capsAtElapsed() {
        // delta 30 秒但实际仅过 10 秒（正常跳跃范围内）→ 不超过 elapsed
        HeartbeatContext ctx = new HeartbeatContext(30, 1.0, 0, 0, baseTime, baseTime.plusSeconds(10));
        assertThat(engine.evaluate(ctx)).isEqualTo(10);
    }

    @Test
    void speedExactly2_returnsDelta() {
        // 恰好 2.0x → 仍计入
        HeartbeatContext ctx = new HeartbeatContext(20, 2.0, 0, 0, baseTime, baseTime.plusSeconds(10));
        assertThat(engine.evaluate(ctx)).isEqualTo(10);
    }

    @Test
    void smallJumpWithin30Seconds_returnsDelta() {
        // 小跳跃 15 秒（在 30 秒范围内）→ 计 delta
        HeartbeatContext ctx = new HeartbeatContext(15, 1.0, 0, 0, baseTime, baseTime.plusSeconds(5));
        assertThat(engine.evaluate(ctx)).isEqualTo(5);
    }
}
