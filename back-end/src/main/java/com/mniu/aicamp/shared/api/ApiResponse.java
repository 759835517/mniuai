package com.mniu.aicamp.shared.api;

import java.time.Instant;

public record ApiResponse<T>(boolean success, T data, ErrorBody error, Instant timestamp) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null, Instant.now());
    }

    @SuppressWarnings("unchecked")
    public static <T> ApiResponse<T> ok() {
        return new ApiResponse<>(true, null, null, Instant.now());
    }

    public static <T> ApiResponse<T> error(String code, String message) {
        return new ApiResponse<>(false, null, new ErrorBody(code, message), Instant.now());
    }

    public record ErrorBody(String code, String message) {
    }
}
