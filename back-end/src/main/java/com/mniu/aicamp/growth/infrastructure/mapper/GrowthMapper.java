package com.mniu.aicamp.growth.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.growth.infrastructure.po.GrowthPO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface GrowthMapper extends BaseMapper<GrowthPO> {
}
