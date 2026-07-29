package com.mniu.aicamp.course.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * courses table.
 * Stores course metadata (title, category, difficulty, etc.).
 */
@TableName("courses")
@Getter
@Setter
public class CoursePO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private String title;
    private String description;
    private String coverUrl;
    private String category;
    private String difficulty;
    private String targetAudience;
    private Integer totalLessons;
    private Integer totalMinutes;
    private String status;
    private Integer sortOrder;
    private Instant createdAt;
}
