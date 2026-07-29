package com.mniu.aicamp.kids.application;

/**
 * 成长勋章 DTO
 *
 * @param id          勋章 ID
 * @param slug        URL 友好标识
 * @param name        勋章名称
 * @param description 勋章描述
 * @param icon        emoji 图标
 * @param category    勋章类别：COURSE / PRACTICE / COMPETITION / STREAK
 * @param requirement 达成条件数量
 * @param earned      是否已获得（用于前端展示）
 */
public record GrowthBadgeDTO(
        Long id,
        String slug,
        String name,
        String description,
        String icon,
        String category,
        Integer requirement,
        boolean earned
) {
}
