package com.mniu.aicamp.project.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.project.infrastructure.po.ProjectTaskPO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProjectTaskMapper extends BaseMapper<ProjectTaskPO> {
}
