package com.mniu.aicamp.video.infrastructure.po;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * video_heartbeats table (partitioned by recorded_at).
 * Each row is a single heartbeat event from a user watching a lesson.
 * Primary key is (recorded_at, id) to satisfy PostgreSQL partition constraint.
 */
@TableName("video_heartbeats")
@Getter
@Setter
public class VideoHeartbeatPO {
    @TableId
    private Long id;
    private Long userId;
    private Long lessonId;
    private Integer positionSec;
    private BigDecimal speed;
    private Instant recordedAt;
}
