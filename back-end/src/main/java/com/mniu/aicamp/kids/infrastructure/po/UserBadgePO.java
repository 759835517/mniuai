package com.mniu.aicamp.kids.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

/**
 * 用户已获得勋章持久化对象
 * 对应表：user_badges
 * 记录少儿用户获得的勋章及获得时间
 */
@Data
@TableName("user_badges")
public class UserBadgePO {

    /** 主键 ID */
    @TableId(type = IdType.INPUT)
    private Long id;

    /** 用户 ID */
    private Long userId;

    /** 勋章 ID */
    private Long badgeId;

    /** 获得时间 */
    private Instant earnedAt;
}
