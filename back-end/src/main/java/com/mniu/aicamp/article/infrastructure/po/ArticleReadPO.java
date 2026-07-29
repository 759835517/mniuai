package com.mniu.aicamp.article.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@TableName("article_reads")
@Getter
@Setter
public class ArticleReadPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long userId;
    private Long articleId;
    private Double scrollRatio;
    private Integer readSeconds;
    private Boolean completed;
    private Instant firstReadAt;
    private Instant lastReadAt;
}
