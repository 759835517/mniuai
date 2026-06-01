package com.mniu.aicamp.shared.api;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class PageResponseTest {
    @Test
    void paginatesValuesAndReportsNextPage() {
        PageResponse<Integer> page = PageResponse.of(List.of(1, 2, 3, 4, 5), 1, 2);

        assertThat(page.items()).containsExactly(3, 4);
        assertThat(page.page()).isEqualTo(1);
        assertThat(page.size()).isEqualTo(2);
        assertThat(page.totalElements()).isEqualTo(5);
        assertThat(page.totalPages()).isEqualTo(3);
        assertThat(page.hasNext()).isTrue();
    }

    @Test
    void normalizesNegativePageAndInvalidSize() {
        PageResponse<String> page = PageResponse.of(List.of("a", "b"), -1, 0);

        assertThat(page.items()).containsExactly("a");
        assertThat(page.page()).isZero();
        assertThat(page.size()).isEqualTo(1);
        assertThat(page.hasNext()).isTrue();
    }

    @Test
    void returnsEmptyItemsWhenPageIsOutOfRange() {
        PageResponse<String> page = PageResponse.of(List.of("a"), 5, 10);

        assertThat(page.items()).isEmpty();
        assertThat(page.totalPages()).isEqualTo(1);
        assertThat(page.hasNext()).isFalse();
    }

    @Test
    void handlesEmptyCollections() {
        PageResponse<String> page = PageResponse.of(List.of(), 0, 10);

        assertThat(page.items()).isEmpty();
        assertThat(page.totalPages()).isZero();
        assertThat(page.hasNext()).isFalse();
    }
}
