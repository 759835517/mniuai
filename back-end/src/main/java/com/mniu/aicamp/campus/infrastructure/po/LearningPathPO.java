package com.mniu.aicamp.campus.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

@Data
@TableName("learning_paths")
public class LearningPathPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private String slug;
    private String name;
    private String description;
    private String icon;
    private Integer durationWeeks;
    private String levelFrom;
    private String levelTo;
    private Integer sortOrder;
    private String status;
    private Instant createdAt;
}
