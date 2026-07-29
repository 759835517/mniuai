package com.mniu.aicamp.course.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * course_enrollments table.
 * Records which users enrolled in which courses.
 */
@TableName("course_enrollments")
@Getter
@Setter
public class CourseEnrollmentPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long userId;
    private Long courseId;
    private Instant enrolledAt;
    private Instant completedAt;
}
