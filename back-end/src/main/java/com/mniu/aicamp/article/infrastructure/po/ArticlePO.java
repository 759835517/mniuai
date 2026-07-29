package com.mniu.aicamp.article.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.mniu.aicamp.interview.infrastructure.typehandler.JsonbTypeHandler;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@TableName("articles")
@Getter
@Setter
public class ArticlePO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private String title;
    private String slug;
    private String summary;
    private String content;
    private String coverUrl;
    private String category;
    @TableField(typeHandler = JsonbTypeHandler.class)
    private String tags;
    private Long authorId;
    private String status;
    private String targetAudience;
    private String difficulty;
    private Integer readMinutes;
    private Long viewCount;
    private Long likeCount;
    private String associatedType;
    private Long associatedId;
    private Instant publishedAt;
    private Instant createdAt;
    private Instant updatedAt;
}
