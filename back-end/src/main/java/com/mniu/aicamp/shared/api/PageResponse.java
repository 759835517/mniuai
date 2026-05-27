package com.mniu.aicamp.shared.api;

import java.util.List;

public record PageResponse<T>(List<T> items, int page, int size, long totalElements, int totalPages, boolean hasNext) {
    public static <T> PageResponse<T> of(List<T> values, int page, int size) {
        int safePage = Math.max(0, page);
        int safeSize = Math.max(1, size);
        int fromIndex = Math.min(safePage * safeSize, values.size());
        int toIndex = Math.min(fromIndex + safeSize, values.size());
        int totalPages = values.isEmpty() ? 0 : (int) Math.ceil(values.size() / (double) safeSize);
        return new PageResponse<>(values.subList(fromIndex, toIndex), safePage, safeSize, values.size(),
                totalPages, safePage + 1 < totalPages);
    }
}
