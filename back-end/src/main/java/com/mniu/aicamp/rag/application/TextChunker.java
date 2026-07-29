package com.mniu.aicamp.rag.application;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * 文本分块工具。
 * 将长文本切分为固定大小的 chunk，支持重叠以保持上下文连贯。
 */
@Component
public class TextChunker {

    private final int chunkSize;
    private final int overlap;

    public TextChunker(
            @Value("${app.rag.chunk-size:500}") int chunkSize,
            @Value("${app.rag.chunk-overlap:50}") int overlap) {
        this.chunkSize = chunkSize;
        this.overlap = overlap;
    }

    /**
     * 将文本分块。
     * 优先在句子边界（". " 或 "\n"）切分，避免切断语义。
     */
    public List<String> chunk(String text) {
        if (text == null || text.isBlank()) {
            return List.of();
        }
        String trimmed = text.trim();
        if (trimmed.length() <= chunkSize) {
            return List.of(trimmed);
        }

        List<String> chunks = new ArrayList<>();
        int start = 0;
        while (start < trimmed.length()) {
            int end = Math.min(start + chunkSize, trimmed.length());

            // 如果不是最后一块，尝试在句子边界切分
            if (end < trimmed.length()) {
                int lastPeriod = trimmed.lastIndexOf(". ", end);
                int lastNewline = trimmed.lastIndexOf("\n", end);
                int breakPoint = Math.max(lastPeriod, lastNewline);
                // 只在合理范围内回溯（不超过 chunkSize 的 50%）
                if (breakPoint > start + chunkSize / 2) {
                    end = breakPoint + 1;
                }
            }

            String chunk = trimmed.substring(start, end).trim();
            if (!chunk.isEmpty()) {
                chunks.add(chunk);
            }
            start = Math.max(end - overlap, start + 1);
        }
        return chunks;
    }
}
