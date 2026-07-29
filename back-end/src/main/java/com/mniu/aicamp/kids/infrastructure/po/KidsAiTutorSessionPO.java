package com.mniu.aicamp.kids.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

/**
 * 少儿 AI 助教会话持久化对象
 * 对应表：kids_ai_tutor_sessions
 * 存储少儿用户的 AI 助教对话会话信息
 */
@Data
@TableName("kids_ai_tutor_sessions")
public class KidsAiTutorSessionPO {

    /** 主键 ID */
    @TableId(type = IdType.INPUT)
    private Long id;

    /** 用户 ID */
    private Long userId;

    /** 会话标题 */
    private String title;

    /** 关联课时 ID（可为空） */
    private Long lessonId;

    /** 创建时间 */
    private Instant createdAt;
}
