package com.mniu.aicamp.roadmap.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.roadmap.infrastructure.po.RoadmapPO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RoadmapMapper extends BaseMapper<RoadmapPO> {
}
