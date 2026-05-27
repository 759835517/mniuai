package com.mniu.aicamp.review.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.review.infrastructure.po.CodeReviewPO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CodeReviewMapper extends BaseMapper<CodeReviewPO> {
}
