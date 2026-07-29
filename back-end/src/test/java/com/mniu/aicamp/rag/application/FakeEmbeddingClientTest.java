package com.mniu.aicamp.rag.application;

import com.mniu.aicamp.shared.exception.BusinessException;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.within;

/**
 * FakeEmbeddingClient 单元测试：覆盖伪向量生成的 5 个场景。
 */
class FakeEmbeddingClientTest {
    private final FakeEmbeddingClient client = new FakeEmbeddingClient();

    @Test
    void dimension_returns1536() {
        assertThat(client.dimension()).isEqualTo(1536);
    }

    @Test
    void embed_returnsCorrectDimension() {
        List<Double> vec = client.embed("Hello world");
        assertThat(vec).hasSize(1536);
    }

    @Test
    void embed_sameText_returnsSameVector() {
        List<Double> vec1 = client.embed("Hello world");
        List<Double> vec2 = client.embed("Hello world");
        assertThat(vec1).isEqualTo(vec2);
    }

    @Test
    void embed_differentText_returnsDifferentVector() {
        List<Double> vec1 = client.embed("Hello world");
        List<Double> vec2 = client.embed("Goodbye world");
        assertThat(vec1).isNotEqualTo(vec2);
    }

    @Test
    void embed_normalizedToUnitLength() {
        List<Double> vec = client.embed("Normalization test");
        double norm = 0;
        for (double v : vec) {
            norm += v * v;
        }
        norm = Math.sqrt(norm);
        assertThat(norm).isCloseTo(1.0, within(0.001));
    }

    @Test
    void embed_nullText_throwsBusinessException() {
        assertThatThrownBy(() -> client.embed(null))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void embed_blankText_throwsBusinessException() {
        assertThatThrownBy(() -> client.embed("   "))
                .isInstanceOf(BusinessException.class);
    }
}
