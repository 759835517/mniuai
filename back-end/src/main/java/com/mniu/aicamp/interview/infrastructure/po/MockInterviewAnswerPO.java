package com.mniu.aicamp.interview.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.mniu.aicamp.interview.infrastructure.typehandler.JsonbTypeHandler;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@TableName("mock_interview_answers")
@Getter
@Setter
public class MockInterviewAnswerPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long mockInterviewId;
    private Long questionId;
    private Integer questionOrder;
    private String userAnswer;
    private Integer aiScore;
    private String aiFeedback;
    @TableField(typeHandler = JsonbTypeHandler.class)
    private String aiKeyPointsHit;
    private Integer thinkingSeconds;
    private Instant answeredAt;
}
