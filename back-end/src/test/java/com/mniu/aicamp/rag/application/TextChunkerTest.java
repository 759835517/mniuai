package com.mniu.aicamp.rag.application;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * TextChunker 单元测试：覆盖分块逻辑的 5 个场景。
 */
class TextChunkerTest {
    private final TextChunker chunker = new TextChunker(500, 50);

    @Test
    void nullInput_returnsEmptyList() {
        assertThat(chunker.chunk(null)).isEmpty();
    }

    @Test
    void blankInput_returnsEmptyList() {
        assertThat(chunker.chunk("   ")).isEmpty();
    }

    @Test
    void shortText_returnsSingleChunk() {
        String text = "Hello world.";
        List<String> chunks = chunker.chunk(text);
        assertThat(chunks).hasSize(1);
        assertThat(chunks.getFirst()).isEqualTo("Hello world.");
    }

    @Test
    void longText_splitsMultipleChunks() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 20; i++) {
            sb.append("This is sentence number ").append(i).append(". ");
        }
        String text = sb.toString().trim();
        List<String> chunks = chunker.chunk(text);
        assertThat(chunks.size()).isGreaterThan(1);
        // 每个 chunk 不超过 chunkSize（允许边界容差）
        for (String chunk : chunks) {
            assertThat(chunk.length()).isLessThanOrEqualTo(510);
        }
    }

    @Test
    void chunksPreserveAllContent() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 50; i++) {
            sb.append("Word").append(i).append(" ");
        }
        String text = sb.toString().trim();
        List<String> chunks = chunker.chunk(text);
        assertThat(chunks).isNotEmpty();
        // 拼接后应包含所有原始单词（不考虑重叠）
        String joined = String.join(" ", chunks);
        for (int i = 0; i < 50; i++) {
            assertThat(joined).contains("Word" + i);
        }
    }

    @Test
    void overlapEnabled_chunksHaveSharedContent() {
        // 构造刚好超过 chunkSize 的文本，验证 overlap
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 100; i++) {
            sb.append("token").append(i).append(" ");
        }
        String text = sb.toString().trim();
        List<String> chunks = chunker.chunk(text);
        if (chunks.size() >= 2) {
            // 相邻 chunk 之间应有重叠内容
            String first = chunks.get(0);
            String second = chunks.get(1);
            // second 中应包含 first 末尾的某些 token
            String[] firstTokens = first.split(" ");
            String lastToken = firstTokens[firstTokens.length - 1];
            assertThat(second).contains(lastToken);
        }
    }
}
