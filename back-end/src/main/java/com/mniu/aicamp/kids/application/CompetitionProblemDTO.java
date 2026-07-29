package com.mniu.aicamp.kids.application;

/**
 * 竞赛题目 DTO
 *
 * @param id            题目 ID
 * @param slug          URL 友好标识
 * @param title         题目标题
 * @param difficulty    难度：PRIMARY / JUNIOR / SENIOR
 * @param category      竞赛类别：CSP / NOI / BLUE_BRIDGE
 * @param content       题目描述
 * @param inputFormat   输入格式说明
 * @param outputFormat  输出格式说明
 * @param sampleInput   样例输入
 * @param sampleOutput  样例输出
 * @param hint          提示
 * @param timeLimitMs   时间限制（毫秒）
 * @param memoryLimitMb 内存限制（MB）
 */
public record CompetitionProblemDTO(
        Long id,
        String slug,
        String title,
        String difficulty,
        String category,
        String content,
        String inputFormat,
        String outputFormat,
        String sampleInput,
        String sampleOutput,
        String hint,
        Integer timeLimitMs,
        Integer memoryLimitMb
) {
}
