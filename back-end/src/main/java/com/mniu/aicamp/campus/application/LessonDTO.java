package com.mniu.aicamp.campus.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/**
 * 课时内容（视频 + 练习信息）
 */
public record LessonDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long id,
        @JsonSerialize(using = ToStringSerializer.class) Long courseId,
        String title,
        String description,
        String videoUrl,
        Integer videoDuration,
        String thumbnailUrl,
        Integer sortOrder,
        Boolean isFree,
        // 当前用户进度
        Integer lastPositionSec,
        Boolean completed,
        Double watchRatio
) {
}
