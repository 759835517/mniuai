package com.mniu.aicamp.rag.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.rag.infrastructure.po.DocumentChunkPO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface DocumentChunkMapper extends BaseMapper<DocumentChunkPO> {

    /**
     * 余弦相似度检索（pgvector 的 <=> 操作符是余弦距离）。
     * 返回 topK 最相关的 chunk，按相似度降序。
     *
     * @param embeddingJson embedding 向量 JSON 数组字符串
     * @param lessonId     课时 ID（可为 null 表示全库检索）
     * @param limit        返回数量
     */
    List<DocumentChunkResult> searchSimilar(
            @Param("embedding") String embeddingJson,
            @Param("lessonId") Long lessonId,
            @Param("limit") int limit);

    /**
     * 检索结果 DTO。
     */
    record DocumentChunkResult(
            Long id,
            Long lessonId,
            Long courseId,
            Integer chunkIndex,
            String content,
            Double similarity
    ) {}
}
