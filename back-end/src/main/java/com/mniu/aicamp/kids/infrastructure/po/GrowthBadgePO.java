package com.mniu.aicamp.kids.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

/**
 * 成长勋章定义持久化对象
 * 对应表：growth_badges
 * 定义少儿用户可获得的各类勋章及其达成条件
 */
@Data
@TableName("growth_badges")
public class GrowthBadgePO {

    /** 主键 ID */
    @TableId(type = IdType.INPUT)
    private Long id;

    /** URL 友好唯一标识 */
    private String slug;

    /** 勋章名称 */
    private String name;

    /** 勋章描述 */
    private String description;

    /** emoji 图标 */
    private String icon;

    /** 勋章类别：COURSE / PRACTICE / COMPETITION / STREAK */
    private String category;

    /** 达成条件数量 */
    private Integer requirement;

    /** 排序权重 */
    private Integer sortOrder;

    /** 创建时间 */
    private Instant createdAt;
}
