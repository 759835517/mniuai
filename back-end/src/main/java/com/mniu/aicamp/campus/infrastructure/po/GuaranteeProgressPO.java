package com.mniu.aicamp.campus.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

@Data
@TableName("guarantee_progress")
public class GuaranteeProgressPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long userId;
    private Long pathId;
    private java.math.BigDecimal courseCompletionPct;
    private Integer practiceCompleted;
    private Integer practicePassed;
    private Integer projectsSubmitted;
    private Integer projectsApproved;
    private Integer interviewRounds;
    private Boolean resumeGenerated;
    private Integer jobApplications;
    private Boolean isEmployed;
    private Instant updatedAt;
}
