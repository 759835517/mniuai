package com.mniu.aicamp.roadmap.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.roadmap.infrastructure.po.RoadmapTaskPO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RoadmapTaskMapper extends BaseMapper<RoadmapTaskPO> {
}
