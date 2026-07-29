package com.mniu.aicamp.interview.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@TableName("interview_questions")
@Getter
@Setter
public class InterviewQuestionPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private String category;
    private String subCategory;
    private String difficulty;
    private String title;
    private String content;
    private String expectedAnswer;
    @TableField(typeHandler = JacksonTypeHandler.class)
    private String keyPoints;
    @TableField(typeHandler = JacksonTypeHandler.class)
    private String companies;
    @TableField(typeHandler = JacksonTypeHandler.class)
    private String tags;
    private String source;
    private String status;
    private Long viewCount;
    private Instant createdAt;
    private Instant updatedAt;
}
