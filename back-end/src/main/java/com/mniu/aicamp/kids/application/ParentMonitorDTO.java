package com.mniu.aicamp.kids.application;

import java.time.LocalDate;
import java.util.Map;

/**
 * 家长监控记录 DTO
 *
 * @param id           记录 ID
 * @param childUserId  少儿用户 ID
 * @param dailyMinutes 当日学习分钟数
 * @param logDate      记录日期
 * @param activities   活动分类统计
 */
public record ParentMonitorDTO(
        Long id,
        Long childUserId,
        Integer dailyMinutes,
        LocalDate logDate,
        Map<String, Object> activities
) {
}
