package com.mniu.aicamp.video.application;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;

/**
 * 心跳请求体。
 */
public record HeartbeatRequest(@Min(0) int positionSec,
                               @DecimalMin("0.5") @DecimalMax("4.0") double speed) {
}
