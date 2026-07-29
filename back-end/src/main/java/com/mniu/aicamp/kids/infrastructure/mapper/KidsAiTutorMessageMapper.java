package com.mniu.aicamp.kids.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.kids.infrastructure.po.KidsAiTutorMessagePO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 少儿 AI 助教消息 Mapper
 * 提供 kids_ai_tutor_messages 表的基础 CRUD 操作
 */
@Mapper
public interface KidsAiTutorMessageMapper extends BaseMapper<KidsAiTutorMessagePO> {
}
