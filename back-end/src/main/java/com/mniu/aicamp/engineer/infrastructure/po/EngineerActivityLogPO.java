package com.mniu.aicamp.engineer.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

/**
 * 程序员学习行为日志PO
 */
@Data
@TableName("engineer_activity_log")
public class EngineerActivityLogPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long userId;
    private String activityType;
    private String refId;
    private Integer score;
    private Instant createdAt;
}
