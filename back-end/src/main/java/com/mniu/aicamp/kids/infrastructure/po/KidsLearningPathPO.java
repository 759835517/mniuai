package com.mniu.aicamp.kids.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

/**
 * 少儿学习路径持久化对象
 * 对应表：kids_learning_paths
 * 面向 8-15 岁学生的编程学习路径（Scratch→Python→算法→AI创作→竞赛冲刺）
 */
@Data
@TableName("kids_learning_paths")
public class KidsLearningPathPO {

    /** 主键 ID（雪花算法生成） */
    @TableId(type = IdType.INPUT)
    private Long id;

    /** URL 友好唯一标识 */
    private String slug;

    /** 路径名称 */
    private String name;

    /** 路径描述 */
    private String description;

    /** emoji 图标 */
    private String icon;

    /** 阶段：SCRATCH / PYTHON / ALGORITHM / AI_CREATION / COMPETITION */
    private String stage;

    /** 学习周期（周） */
    private Integer durationWeeks;

    /** 起始等级 */
    private String levelFrom;

    /** 目标等级 */
    private String levelTo;

    /** 报名人数（冗余字段） */
    private Integer studentCount;

    /** 排序权重 */
    private Integer sortOrder;

    /** 状态：PUBLISHED / DRAFT */
    private String status;

    /** 创建时间 */
    private Instant createdAt;
}
