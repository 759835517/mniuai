package com.mniu.aicamp.rag.application;

import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * 伪 Embedding 实现（测试用）。
 * 基于文本 hash 生成确定性伪向量，无需调用外部 API。
 */
@Component
@ConditionalOnProperty(name = "app.ai.provider", havingValue = "fake")
public class FakeEmbeddingClient implements EmbeddingPort {

    private static final int DIMENSIONS = 1536;

    @Override
    public List<Double> embed(String text) {
        if (text == null || text.isBlank()) {
            throw new BusinessException(ErrorCode.EMBEDDING_ERROR, "Cannot embed empty text");
        }
        Random rng = new Random(text.hashCode());
        List<Double> vec = new ArrayList<>(DIMENSIONS);
        double norm = 0;
        for (int i = 0; i < DIMENSIONS; i++) {
            double v = rng.nextGaussian();
            vec.add(v);
            norm += v * v;
        }
        norm = Math.sqrt(norm);
        if (norm == 0) norm = 1;
        List<Double> normalized = new ArrayList<>(DIMENSIONS);
        for (Double v : vec) {
            normalized.add(v / norm);
        }
        return normalized;
    }

    @Override
    public int dimension() {
        return DIMENSIONS;
    }
}
