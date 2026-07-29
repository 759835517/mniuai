package com.mniu.aicamp.campus.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.util.List;

/**
 * 学习路径详情（含课程列表 + 当前用户进度）
 */
public record PathDetailDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long id,
        String slug,
        String name,
        String description,
        String icon,
        Integer durationWeeks,
        String levelFrom,
        String levelTo,
        List<CourseSummaryDTO> courses,
        Boolean enrolled,
        Double progressPct
) {
}
