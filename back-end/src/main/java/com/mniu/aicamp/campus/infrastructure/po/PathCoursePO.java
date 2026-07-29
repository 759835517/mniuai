package com.mniu.aicamp.campus.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("path_courses")
public class PathCoursePO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long pathId;
    private Long courseId;
    private Integer sortOrder;
    private Boolean required;
}
