package com.mniu.aicamp.quiz.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.mniu.aicamp.interview.infrastructure.typehandler.JsonbTypeHandler;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@TableName("exam_questions")
@Getter
@Setter
public class ExamQuestionPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long examId;
    private String questionType;
    private Integer orderNum;
    private String content;
    @TableField(typeHandler = JsonbTypeHandler.class)
    private String options;
    @TableField(typeHandler = JsonbTypeHandler.class)
    private String correctAnswer;
    private String explanation;
    private Integer xpReward;
    private Instant createdAt;
}
