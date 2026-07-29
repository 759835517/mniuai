package com.mniu.aicamp.quiz.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.mniu.aicamp.interview.infrastructure.typehandler.JsonbTypeHandler;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@TableName("exam_records")
@Getter
@Setter
public class ExamRecordPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long userId;
    private Long examId;
    private Integer score;
    private Boolean passed;
    private Integer totalQuestions;
    private Integer correctCount;
    @TableField(typeHandler = JsonbTypeHandler.class)
    private String answers;
    @TableField(typeHandler = JsonbTypeHandler.class)
    private String aiEvaluation;
    private Instant startedAt;
    private Instant completedAt;
    private Instant createdAt;
}
