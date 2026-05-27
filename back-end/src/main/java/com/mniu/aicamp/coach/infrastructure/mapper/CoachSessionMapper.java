package com.mniu.aicamp.coach.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.coach.infrastructure.po.CoachSessionPO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CoachSessionMapper extends BaseMapper<CoachSessionPO> {
}
