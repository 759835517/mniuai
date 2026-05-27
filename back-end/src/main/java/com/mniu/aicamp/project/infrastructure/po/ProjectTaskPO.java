package com.mniu.aicamp.project.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

/** project_tasks table. Stores checklist tasks for an AI project plan. */
@TableName("project_tasks")
@Getter
@Setter
public class ProjectTaskPO {
    /** Primary key: project task id. */
    @TableId(type = IdType.INPUT)
    private Long id;
    /** Parent project id. */
    private Long projectId;
    /** Task title. */
    private String title;
    /** Completion state. */
    private Boolean completed;
}
