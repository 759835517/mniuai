package com.mniu.aicamp.coach.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/** coach_sessions table. Stores AI coach chat sessions. */
@TableName("coach_sessions")
@Getter
@Setter
public class CoachSessionPO {
    /** Primary key: coach session id. */
    @TableId(type = IdType.INPUT)
    private Long id;
    /** Owner user id. */
    private Long userId;
    /** Session title. */
    private String title;
    /** Context type such as GENERAL, PROJECT or ROADMAP. */
    private String contextType;
    /** Row creation time. */
    private Instant createdAt;
}
