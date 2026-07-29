package com.mniu.aicamp.kids.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.kids.infrastructure.po.CompetitionSubmissionPO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 竞赛代码提交记录 Mapper
 * 提供 competition_submissions 表的基础 CRUD 操作
 */
@Mapper
public interface CompetitionSubmissionMapper extends BaseMapper<CompetitionSubmissionPO> {
}
