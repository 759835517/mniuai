package com.mniu.aicamp.engineer.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

/**
 * 程序员学习进度PO（对赌条件追踪）
 */
@Data
@TableName("engineer_progress")
public class EngineerProgressPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long userId;
    private Integer solvedProblems;
    private Integer completedTasks;
    private Integer interviewRounds;
    private Integer systemDesignCount;
    private Integer codeReviewCount;
    private Integer jobApplications;
    private Instant updatedAt;
}
