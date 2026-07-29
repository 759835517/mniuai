package com.mniu.aicamp.rag.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mniu.aicamp.course.infrastructure.mapper.LessonMapper;
import com.mniu.aicamp.course.infrastructure.po.LessonPO;
import com.mniu.aicamp.rag.infrastructure.mapper.DocumentChunkMapper;
import com.mniu.aicamp.rag.infrastructure.po.DocumentChunkPO;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class DocumentChunkService {

    private final DocumentChunkMapper chunkMapper;
    private final LessonMapper lessonMapper;
    private final EmbeddingPort embeddingPort;
    private final TextChunker chunker;
    private final SnowflakeIdGenerator idGenerator;

    public DocumentChunkService(DocumentChunkMapper chunkMapper,
                                LessonMapper lessonMapper,
                                EmbeddingPort embeddingPort,
                                TextChunker chunker,
                                SnowflakeIdGenerator idGenerator) {
        this.chunkMapper = chunkMapper;
        this.lessonMapper = lessonMapper;
        this.embeddingPort = embeddingPort;
        this.chunker = chunker;
        this.idGenerator = idGenerator;
    }

    /**
     * 为单个课时生成文档分块并索引。
     *
     * @return 生成的 chunk 数量
     */
    @Transactional
    public int indexLesson(Long lessonId) {
        LessonPO lesson = lessonMapper.selectById(lessonId);
        if (lesson == null) {
            return 0;
        }

        // 删除旧 chunk
        chunkMapper.delete(Wrappers.<DocumentChunkPO>lambdaQuery()
                .eq(DocumentChunkPO::getLessonId, lessonId));

        // 拼接课时内容
        String fullText = lesson.getTitle() + "\n"
                + (lesson.getDescription() != null ? lesson.getDescription() : "");

        // 分块
        List<String> chunks = chunker.chunk(fullText);
        if (chunks.isEmpty()) {
            return 0;
        }

        // Embedding + 存储
        for (int i = 0; i < chunks.size(); i++) {
            List<Double> embedding = embeddingPort.embed(chunks.get(i));
            DocumentChunkPO po = new DocumentChunkPO();
            po.setId(idGenerator.nextId());
            po.setLessonId(lessonId);
            po.setCourseId(lesson.getCourseId());
            po.setChunkIndex(i);
            po.setContent(chunks.get(i));
            po.setEmbedding(embedding);
            po.setMetadata(Map.of(
                    "source", "lesson",
                    "title", lesson.getTitle() != null ? lesson.getTitle() : ""
            ));
            po.setCreatedAt(Instant.now());
            chunkMapper.insert(po);
        }
        return chunks.size();
    }

    /**
     * 批量索引所有已发布课时。
     *
     * @return 总 chunk 数量
     */
    public int indexAllPublishedLessons() {
        List<LessonPO> lessons = lessonMapper.selectList(
                Wrappers.<LessonPO>lambdaQuery().eq(LessonPO::getStatus, "PUBLISHED"));
        int total = 0;
        for (LessonPO lesson : lessons) {
            total += indexLesson(lesson.getId());
        }
        return total;
    }
}
