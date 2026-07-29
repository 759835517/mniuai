package com.mniu.aicamp.kids.application;

/**
 * 少儿学习进度总览 DTO
 *
 * @param totalPaths       学习路径总数
 * @param enrolledPaths    已报名路径数
 * @param completedLessons 已完成课时数
 * @param totalPractice    练习提交总数
 * @param passedPractice   通过练习数
 * @param earnedBadges     已获得勋章数
 * @param streakDays       连续学习天数
 */
public record KidsProgressDTO(
        int totalPaths,
        int enrolledPaths,
        int completedLessons,
        int totalPractice,
        int passedPractice,
        int earnedBadges,
        int streakDays
) {
}
