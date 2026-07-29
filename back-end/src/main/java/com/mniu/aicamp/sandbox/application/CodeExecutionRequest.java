package com.mniu.aicamp.sandbox.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * 代码执行请求。
 *
 * @param languageId     Judge0 language_id（71=Python, 63=JS, 54=C++, 62=Java 等）
 * @param sourceCode     源代码
 * @param stdin          标准输入（可选）
 * @param expectedOutput 期望输出（可选，用于比对）
 * @param lessonId       关联课时 ID（可选）
 * @param timeLimitSec   时间限制（秒），默认 5
 * @param memoryLimitMb  内存限制（MB），默认 256
 */
public record CodeExecutionRequest(@NotNull Integer languageId,
                                   @NotBlank String sourceCode,
                                   String stdin,
                                   String expectedOutput,
                                   Long lessonId,
                                   Integer timeLimitSec,
                                   Integer memoryLimitMb) {
    public CodeExecutionRequest {
        if (timeLimitSec == null) timeLimitSec = 5;
        if (memoryLimitMb == null) memoryLimitMb = 256;
    }
}
