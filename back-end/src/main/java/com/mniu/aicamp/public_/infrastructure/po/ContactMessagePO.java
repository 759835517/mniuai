package com.mniu.aicamp.public_.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * contact_messages table.
 * Stores contact form submissions from the website.
 */
@TableName("contact_messages")
@Getter
@Setter
public class ContactMessagePO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private String name;
    private String email;
    private String type;
    private String message;
    private String status;
    private Instant createdAt;
}
