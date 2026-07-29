package com.mniu.aicamp.kids.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.kids.infrastructure.po.KidsLearningPathPO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 少儿学习路径 Mapper
 * 提供 kids_learning_paths 表的基础 CRUD 操作
 */
@Mapper
public interface KidsLearningPathMapper extends BaseMapper<KidsLearningPathPO> {
}
