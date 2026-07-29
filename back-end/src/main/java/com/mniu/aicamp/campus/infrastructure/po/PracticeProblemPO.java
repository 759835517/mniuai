package com.mniu.aicamp.campus.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

@Data
@TableName("practice_problems")
public class PracticeProblemPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private String slug;
    private String title;
    private String description;
    private String difficulty;
    private String category;
    private String tags;
    private String starterCode;
    private String solutionCode;
    private String testCases;
    private Integer timeLimitSec;
    private Integer memoryLimitMb;
    private Integer sortOrder;
    private String status;
    private Instant createdAt;
}
