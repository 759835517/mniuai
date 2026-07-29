package com.mniu.aicamp.rag.application;

import com.mniu.aicamp.rag.infrastructure.mapper.DocumentChunkMapper;
import com.mniu.aicamp.rag.infrastructure.mapper.DocumentChunkMapper.DocumentChunkResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * RagService 单元测试：覆盖检索和 context 构建的 6 个场景。
 */
@ExtendWith(MockitoExtension.class)
class RagServiceTest {

    @Mock
    private DocumentChunkMapper chunkMapper;

    @Mock
    private EmbeddingPort embeddingPort;

    private RagService ragService;

    @BeforeEach
    void setUp() {
        ragService = new RagService(chunkMapper, embeddingPort, 3, 0.6);
    }

    @Test
    void search_blankQuery_returnsEmpty() {
        List<DocumentChunkResult> results = ragService.search("   ", null);
        assertThat(results).isEmpty();
        verifyNoInteractions(chunkMapper, embeddingPort);
    }

    @Test
    void search_nullQuery_returnsEmpty() {
        List<DocumentChunkResult> results = ragService.search(null, null);
        assertThat(results).isEmpty();
        verifyNoInteractions(chunkMapper, embeddingPort);
    }

    @Test
    void search_withResults_returnsChunks() {
        when(embeddingPort.embed("test query")).thenReturn(List.of(0.1, 0.2, 0.3));
        DocumentChunkResult chunk = new DocumentChunkResult(1L, 10L, 100L, 0, "Test content", 0.85);
        when(chunkMapper.searchSimilar(anyString(), isNull(), eq(3)))
                .thenReturn(List.of(chunk));

        List<DocumentChunkResult> results = ragService.search("test query", null);

        assertThat(results).hasSize(1);
        assertThat(results.getFirst().content()).isEqualTo("Test content");
        assertThat(results.getFirst().similarity()).isEqualTo(0.85);
    }

    @Test
    void search_filtersLowSimilarityResults() {
        when(embeddingPort.embed("low sim")).thenReturn(List.of(0.1, 0.2));
        DocumentChunkResult high = new DocumentChunkResult(1L, 10L, 100L, 0, "High", 0.9);
        DocumentChunkResult low = new DocumentChunkResult(2L, 10L, 100L, 1, "Low", 0.3);
        when(chunkMapper.searchSimilar(anyString(), any(), anyInt()))
                .thenReturn(List.of(high, low));

        List<DocumentChunkResult> results = ragService.search("low sim", 1L);

        assertThat(results).hasSize(1);
        assertThat(results.getFirst().content()).isEqualTo("High");
    }

    @Test
    void buildRagContext_noResults_returnsEmptyString() {
        when(embeddingPort.embed("empty")).thenReturn(List.of(0.5));
        when(chunkMapper.searchSimilar(anyString(), any(), anyInt()))
                .thenReturn(List.of());

        String context = ragService.buildRagContext("empty", null);

        assertThat(context).isEmpty();
    }

    @Test
    void buildRagContext_withResults_returnsFormattedContext() {
        when(embeddingPort.embed("java")).thenReturn(List.of(0.1, 0.9));
        DocumentChunkResult chunk1 = new DocumentChunkResult(1L, 10L, 100L, 0, "Java is a language", 0.92);
        DocumentChunkResult chunk2 = new DocumentChunkResult(2L, 10L, 100L, 1, "Spring Boot framework", 0.88);
        when(chunkMapper.searchSimilar(anyString(), isNull(), eq(3)))
                .thenReturn(List.of(chunk1, chunk2));

        String context = ragService.buildRagContext("java", null);

        assertThat(context).contains("课程知识库参考");
        assertThat(context).contains("参考资料 1");
        assertThat(context).contains("参考资料 2");
        assertThat(context).contains("Java is a language");
        assertThat(context).contains("Spring Boot framework");
    }
}
