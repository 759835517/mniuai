package com.mniu.aicamp.kids.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

/**
 * 少儿 AI 助教消息持久化对象
 * 对应表：kids_ai_tutor_messages
 * 存储少儿用户与 AI 助教的对话消息
 */
@Data
@TableName("kids_ai_tutor_messages")
public class KidsAiTutorMessagePO {

    /** 主键 ID */
    @TableId(type = IdType.INPUT)
    private Long id;

    /** 所属会话 ID */
    private Long sessionId;

    /** 消息角色：user / assistant */
    private String role;

    /** 消息内容 */
    private String content;

    /** 创建时间 */
    private Instant createdAt;
}
