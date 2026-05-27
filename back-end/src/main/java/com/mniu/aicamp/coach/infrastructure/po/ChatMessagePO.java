package com.mniu.aicamp.coach.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/** chat_messages table. Stores user and assistant messages for a coach session. */
@TableName("chat_messages")
@Getter
@Setter
public class ChatMessagePO {
    /** Primary key: chat message id. */
    @TableId(type = IdType.INPUT)
    private Long id;
    /** Parent coach session id. */
    private Long sessionId;
    /** Message role: user or assistant. */
    private String role;
    /** Message body. */
    private String content;
    /** Row creation time. */
    private Instant createdAt;
}
