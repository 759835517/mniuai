package com.mniu.aicamp.quiz.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@TableName("exams")
@Getter
@Setter
public class ExamPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long roadmapId;
    private Integer week;
    private String title;
    private String description;
    private Integer questionCount;
    private Integer timeLimitMinutes;
    private Integer passingScore;
    private Instant createdAt;
}
