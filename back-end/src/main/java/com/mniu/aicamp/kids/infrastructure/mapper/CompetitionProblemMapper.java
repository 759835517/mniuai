package com.mniu.aicamp.kids.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.kids.infrastructure.po.CompetitionProblemPO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 竞赛题目 Mapper
 * 提供 competition_problems 表的基础 CRUD 操作
 */
@Mapper
public interface CompetitionProblemMapper extends BaseMapper<CompetitionProblemPO> {
}
