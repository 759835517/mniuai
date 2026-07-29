package com.mniu.aicamp.kids.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.kids.infrastructure.po.GrowthBadgePO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 成长勋章定义 Mapper
 * 提供 growth_badges 表的基础 CRUD 操作
 */
@Mapper
public interface GrowthBadgeMapper extends BaseMapper<GrowthBadgePO> {
}
