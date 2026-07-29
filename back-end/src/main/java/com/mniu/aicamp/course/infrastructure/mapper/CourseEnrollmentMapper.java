package com.mniu.aicamp.course.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.course.infrastructure.po.CourseEnrollmentPO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CourseEnrollmentMapper extends BaseMapper<CourseEnrollmentPO> {
}
