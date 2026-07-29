package com.mniu.aicamp.kids.application;

/**
 * 少儿学习路径 DTO
 *
 * @param id           路径 ID
 * @param slug         URL 友好标识
 * @param name         路径名称
 * @param description  路径描述
 * @param icon         emoji 图标
 * @param stage        阶段：SCRATCH / PYTHON / ALGORITHM / AI_CREATION / COMPETITION
 * @param durationWeeks 学习周期（周）
 * @param levelFrom    起始等级
 * @param levelTo      目标等级
 * @param studentCount 报名人数
 * @param sortOrder    排序权重
 */
public record KidsLearningPathDTO(
        Long id,
        String slug,
        String name,
        String description,
        String icon,
        String stage,
        Integer durationWeeks,
        String levelFrom,
        String levelTo,
        Integer studentCount,
        Integer sortOrder
) {
}
