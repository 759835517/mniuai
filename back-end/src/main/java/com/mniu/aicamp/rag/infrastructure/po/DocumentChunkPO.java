package com.mniu.aicamp.rag.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.mniu.aicamp.rag.infrastructure.typehandler.MapJsonbTypeHandler;
import com.mniu.aicamp.rag.infrastructure.typehandler.VectorTypeHandler;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * document_chunks table.
 * 存储课程文档分块及其 embedding 向量。
 */
@TableName("document_chunks")
@Getter
@Setter
public class DocumentChunkPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long courseId;
    private Long lessonId;
    private Integer chunkIndex;
    private String content;

    @TableField(typeHandler = VectorTypeHandler.class)
    private List<Double> embedding;

    @TableField(typeHandler = MapJsonbTypeHandler.class)
    private Map<String, Object> metadata;

    private Instant createdAt;
}
