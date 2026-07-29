package com.mniu.aicamp.kids.application;

import java.time.Instant;

/**
 * 竞赛代码提交结果 DTO
 *
 * @param id           提交 ID
 * @param problemId    题目 ID
 * @param language     编程语言
 * @param sourceCode   源代码
 * @param status       评测状态
 * @param passedCount  通过测试用例数
 * @param totalCount   总测试用例数
 * @param runtimeMs    运行时间（毫秒）
 * @param memoryKb     内存消耗（KB）
 * @param submittedAt  提交时间
 */
public record CompetitionSubmissionDTO(
        Long id,
        Long problemId,
        String language,
        String sourceCode,
        String status,
        Integer passedCount,
        Integer totalCount,
        Integer runtimeMs,
        Integer memoryKb,
        Instant submittedAt
) {
}
