package com.mniu.aicamp.project.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.project.infrastructure.po.ProjectPO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProjectMapper extends BaseMapper<ProjectPO> {
}
