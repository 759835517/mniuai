package com.mniu.aicamp.engineer.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.engineer.infrastructure.po.EngineerActivityLogPO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 程序员学习行为日志Mapper
 */
@Mapper
public interface EngineerActivityLogMapper extends BaseMapper<EngineerActivityLogPO> {
}
