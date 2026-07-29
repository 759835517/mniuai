package com.mniu.aicamp.interview.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.interview.infrastructure.po.MockInterviewAnswerPO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MockInterviewAnswerMapper extends BaseMapper<MockInterviewAnswerPO> {
}
