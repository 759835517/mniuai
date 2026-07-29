package com.mniu.aicamp.sandbox.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * sandbox_submissions table.
 * 通用代码执行记录（Judge0 沙盒），不依赖 practice_problems。
 */
@TableName("sandbox_submissions")
@Getter
@Setter
public class SandboxSubmissionPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long userId;
    private Long lessonId;
    private Integer languageId;
    private String sourceCode;
    private String stdin;
    private String expectedOutput;
    private String actualOutput;
    private String status;
    private BigDecimal timeMs;
    private Integer memoryKb;
    private String token;
    private Instant createdAt;
}
