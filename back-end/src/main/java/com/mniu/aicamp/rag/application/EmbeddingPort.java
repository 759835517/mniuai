package com.mniu.aicamp.rag.application;

import java.util.List;

/**
 * Embedding 端口接口。
 * 将文本转换为高维向量，用于语义检索。
 */
public interface EmbeddingPort {

    /**
     * 将单条文本转换为 embedding 向量。
     */
    List<Double> embed(String text);

    /**
     * 返回 embedding 维度（如 1536）。
     */
    int dimension();
}
