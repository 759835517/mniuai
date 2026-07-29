package com.mniu.aicamp.campus.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

@Data
@TableName("code_submissions")
public class CodeSubmissionPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long userId;
    private Long problemId;
    private String language;
    private String sourceCode;
    private String status;
    private Integer passedCount;
    private Integer totalCount;
    private Integer runtimeMs;
    private Integer memoryKb;
    private Instant submittedAt;
}
