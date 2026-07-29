package com.mniu.aicamp.video.application;

/**
 * 播放 URL 响应：包含视频 URL、时长、断点位置、是否完成。
 */
public record PlayUrlResponse(String videoUrl,
                              String hlsManifestUrl,
                              int durationSec,
                              int lastPositionSec,
                              boolean completed) {
}
