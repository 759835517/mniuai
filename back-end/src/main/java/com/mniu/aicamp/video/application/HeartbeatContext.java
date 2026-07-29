package com.mniu.aicamp.video.application;

import java.time.Instant;

/**
 * 心跳上下文：用于 AntiCheatEngine 计算有效增量。
 */
public record HeartbeatContext(int positionSec,
                               double speed,
                               int lastPositionSec,
                               int lastValidWatchedSec,
                               Instant lastHeartbeatAt,
                               Instant now) {
}
