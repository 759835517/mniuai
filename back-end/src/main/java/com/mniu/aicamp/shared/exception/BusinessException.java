package com.mniu.aicamp.shared.exception;

import com.mniu.aicamp.shared.api.ErrorCode;

public class BusinessException extends RuntimeException {
    private final ErrorCode code;

    public BusinessException(ErrorCode code, String message) {
        super(message);
        this.code = code;
    }

    public ErrorCode code() {
        return code;
    }
}
