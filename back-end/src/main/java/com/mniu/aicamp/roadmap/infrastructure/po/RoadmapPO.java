package com.mniu.aicamp.roadmap.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

/** roadmaps table. Stores generated learning roadmaps. */
@TableName("roadmaps")
@Data
public class RoadmapPO {
    /** Primary key: roadmap id. */
    @TableId(type = IdType.INPUT)
    private Long id;
    /** Owner user id. */
    private Long userId;
    /** Target role or learning direction. */
    private String targetRole;
    /** Weekly hours used when generating this roadmap. */
    private Integer weeklyHours;
    /** Whether this is the user's active roadmap. */
    private Boolean active;
    /** Row creation time. */
    private Instant createdAt;
    /** Overall mastery score (0-100) from exam results. */
    private Integer masteryScore;
    /** Mastery level derived from score: MASTERY/GOOD/PASS/FAIL/NOT_TESTED. */
    private String masteryLevel;
    /** Last time an exam was completed for this roadmap. */
    private Instant lastExamAt;
}
