package com.mniu.aicamp.sandbox.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/**
 * 代码执行结果。
 *
 * @param submissionId 提交记录 ID
 * @param status       执行状态（ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, COMPILATION_ERROR, RUNTIME_ERROR 等）
 * @param actualOutput 实际输出
 * @param timeMs       执行时间（毫秒）
 * @param memoryKb     内存占用（KB）
 */
public record CodeExecutionResult(@JsonSerialize(using = ToStringSerializer.class) Long submissionId,
                                  String status,
                                  String actualOutput,
                                  Double timeMs,
                                  Integer memoryKb) {
}
