package com.mniu.aicamp.course.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.course.infrastructure.po.LessonPO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LessonMapper extends BaseMapper<LessonPO> {
}
