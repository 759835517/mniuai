package com.mniu.aicamp.video.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * video_progress table.
 * Persists per-user per-lesson watch progress and valid watched seconds.
 */
@TableName("video_progress")
@Getter
@Setter
public class VideoProgressPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long userId;
    private Long lessonId;
    private Integer lastPositionSec;
    private Integer validWatchedSec;
    private Integer totalDurationSec;
    private Double watchRatio;
    private Boolean completed;
    private Instant updatedAt;
}
