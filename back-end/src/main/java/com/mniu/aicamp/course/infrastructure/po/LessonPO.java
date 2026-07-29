package com.mniu.aicamp.course.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * lessons table.
 * Stores lesson/chapter data linked to a course.
 */
@TableName("lessons")
@Getter
@Setter
public class LessonPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private String videoUrl;
    private String hlsManifestUrl;
    private Integer videoDuration;
    private String thumbnailUrl;
    private Integer sortOrder;
    @TableField("is_free")
    private Boolean free;
    private Boolean requiresExamPass;
    private String status;
    private Instant createdAt;
}
