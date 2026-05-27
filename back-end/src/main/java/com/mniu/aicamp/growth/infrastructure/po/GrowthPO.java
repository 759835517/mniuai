package com.mniu.aicamp.growth.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

/**
 * growth table.
 * Stores a user's XP, level, streak and MVP text-backed achievement/activity lists.
 */
@TableName("growth")
@Getter
@Setter
public class GrowthPO {
    /** Primary key and foreign key to users.id. */
    @TableId(type = IdType.INPUT)
    private Long userId;
    /** Total experience points earned by the user. */
    private Integer xp;
    /** Derived level, currently xp / 100 + 1. */
    private Integer level;
    /** Consecutive activity days. */
    private Integer streakDays;
    /** Newline-separated unlocked achievement codes. */
    private String achievements;
    /** Newline-separated activity event codes. */
    private String activityLog;
}
