package com.mniu.aicamp.kids.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.kids.infrastructure.po.UserBadgePO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户已获得勋章 Mapper
 * 提供 user_badges 表的基础 CRUD 操作
 */
@Mapper
public interface UserBadgeMapper extends BaseMapper<UserBadgePO> {
}
