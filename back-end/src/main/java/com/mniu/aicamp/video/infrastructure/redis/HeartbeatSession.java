package com.mniu.aicamp.video.infrastructure.redis;

import lombok.Data;

/**
 * 心跳会话暂存（Redis 中序列化为字符串）。
 */
@Data
public class HeartbeatSession {
    private int lastPositionSec;
    private int accumulatedValidSec;
    private long lastHeartbeatEpoch;
}
