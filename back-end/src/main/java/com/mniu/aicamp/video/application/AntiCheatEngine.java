package com.mniu.aicamp.video.application;

import org.springframework.stereotype.Component;

/**
 * 防作弊核心算法。
 * 计算本次心跳贡献的 valid_watched_sec 增量。
 *
 * 规则：
 * 1. 倍速 > 2.0 → 无效（返回 0）
 * 2. 60 秒无心跳 → 暂停，本次不计（返回 0）
 * 3. position 跳跃 > 30 秒 → 仅按实际经过秒数计（且不超过 elapsed）
 * 4. 正常前进 → delta = position - lastPos，但不超过 elapsed
 */
@Component
public class AntiCheatEngine {
    public static final double MAX_SPEED = 2.0;
    public static final int MAX_JUMP_SECONDS = 30;
    public static final int SESSION_TIMEOUT_SECONDS = 60;

    /**
     * 计算本次心跳的有效增量。
     * @param ctx 心跳上下文
     * @return 本次应累加的 valid_watched_sec（0 表示无效心跳）
     */
    public int evaluate(HeartbeatContext ctx) {
        // 规则 1: 倍速 > 2.0 → 无效
        if (ctx.speed() > MAX_SPEED) {
            return 0;
        }

        int elapsed = (int) java.time.Duration.between(ctx.lastHeartbeatAt(), ctx.now()).getSeconds();

        // 规则 2: 60 秒无心跳 → 暂停，本次不计
        if (elapsed > SESSION_TIMEOUT_SECONDS) {
            return 0;
        }

        int delta = ctx.positionSec() - ctx.lastPositionSec();

        // 规则 3: 跳跃 > 30 秒 → 仅按实际经过秒数计
        if (Math.abs(delta) > MAX_JUMP_SECONDS) {
            return Math.max(0, Math.min(elapsed, delta > 0 ? delta : 0));
        }

        // 正常前进（不后退、不前跳）
        if (delta <= 0) {
            return 0;
        }

        // 实际经过秒数限制（防止挂后台加速）
        return Math.min(delta, (int) elapsed);
    }
}
