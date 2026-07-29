package com.mniu.aicamp.kids.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.kids.infrastructure.po.KidsAiTutorSessionPO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 少儿 AI 助教会话 Mapper
 * 提供 kids_ai_tutor_sessions 表的基础 CRUD 操作
 */
@Mapper
public interface KidsAiTutorSessionMapper extends BaseMapper<KidsAiTutorSessionPO> {
}
