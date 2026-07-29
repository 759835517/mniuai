package com.mniu.aicamp.interview.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@TableName("interview_sets")
@Getter
@Setter
public class InterviewSetPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private String title;
    private String description;
    private String targetRole;
    private String difficulty;
    @TableField(typeHandler = JacksonTypeHandler.class)
    private String questionIds;
    private Integer durationMinutes;
    private String status;
    private Instant createdAt;
}
