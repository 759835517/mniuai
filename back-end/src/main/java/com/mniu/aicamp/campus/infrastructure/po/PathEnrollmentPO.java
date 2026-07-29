package com.mniu.aicamp.campus.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

@Data
@TableName("path_enrollments")
public class PathEnrollmentPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long userId;
    private Long pathId;
    private Instant enrolledAt;
    private Instant completedAt;
}
