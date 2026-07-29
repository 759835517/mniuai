package com.mniu.aicamp.video.application;

/**
 * 播放进度快照。
 */
public record ProgressSnapshot(int lastPositionSec,
                               int validWatchedSec,
                               int totalDurationSec,
                               double watchRatio,
                               boolean completed) {
}
