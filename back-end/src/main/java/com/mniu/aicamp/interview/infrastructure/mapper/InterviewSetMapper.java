package com.mniu.aicamp.interview.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.interview.infrastructure.po.InterviewSetPO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface InterviewSetMapper extends BaseMapper<InterviewSetPO> {
}
