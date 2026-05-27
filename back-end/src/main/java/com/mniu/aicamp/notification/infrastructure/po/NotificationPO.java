package com.mniu.aicamp.notification.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/** notifications table. Stores in-app notifications and read state per user. */
@TableName("notifications")
@Getter
@Setter
public class NotificationPO {
    /** Primary key: notification id. */
    @TableId(type = IdType.INPUT)
    private Long id;
    /** Owner user id. */
    private Long userId;
    /** Notification category code. */
    private String type;
    /** Human-readable notification message. */
    private String message;
    /** Whether the notification has been read. */
    @TableField("read")
    private Boolean read;
    /** Row creation time. */
    private Instant createdAt;
}
