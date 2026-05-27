package com.mniu.aicamp.user.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * users table.
 * Stores account credentials and the learner profile fields used to generate roadmaps.
 */
@TableName("users")
@Getter
@Setter
public class UserPO {
    /** Primary key: user id. */
    @TableId(type = IdType.INPUT)
    private Long id;
    /** Login email, unique and normalized to lower case. */
    private String email;
    /** BCrypt password hash, never returned by API responses. */
    private String passwordHash;
    /** Public display name shown in the product. */
    private String displayName;
    /** Newline-separated skill names for the MVP schema. */
    private String skills;
    /** Current learning goal or target direction. */
    private String goal;
    /** Weekly learning hours the user can invest. */
    private Integer weeklyHours;
    /** Row creation time. */
    private Instant createdAt;
    /** Last profile update time. */
    private Instant updatedAt;
}
