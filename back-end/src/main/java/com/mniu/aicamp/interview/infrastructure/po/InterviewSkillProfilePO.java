package com.mniu.aicamp.interview.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@TableName("interview_skill_profile")
@Getter
@Setter
public class InterviewSkillProfilePO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long userId;
    private String category;
    private BigDecimal avgScore;
    private Integer interviewCount;
    private Instant lastUpdated;
}
