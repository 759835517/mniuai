package com.mniu.aicamp.roadmap.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

/** roadmap_tasks table. Stores weekly tasks belonging to a roadmap. */
@TableName("roadmap_tasks")
@Getter
@Setter
public class RoadmapTaskPO {
    /** Primary key: roadmap task id. */
    @TableId(type = IdType.INPUT)
    private Long id;
    /** Parent roadmap id. */
    private Long roadmapId;
    /** Roadmap week number, starting from 1. */
    private Integer week;
    /** Task title. */
    private String title;
    /** Completion state. */
    private Boolean completed;
}
