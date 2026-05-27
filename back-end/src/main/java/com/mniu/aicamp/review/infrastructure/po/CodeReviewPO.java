package com.mniu.aicamp.review.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/** code_reviews table. Stores AI code review results for snippets or repository input. */
@TableName("code_reviews")
@Getter
@Setter
public class CodeReviewPO {
    /** Primary key: code review id. */
    @TableId(type = IdType.INPUT)
    private Long id;
    /** Owner user id. */
    private Long userId;
    /** Source language label submitted by the user. */
    private String language;
    /** Numeric review score from 0 to 100. */
    private Integer score;
    /** Newline-separated review suggestions for the MVP schema. */
    private String suggestions;
    /** Row creation time. */
    private Instant createdAt;
}
