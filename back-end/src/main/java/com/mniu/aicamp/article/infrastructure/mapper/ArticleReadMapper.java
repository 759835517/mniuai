package com.mniu.aicamp.article.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.article.infrastructure.po.ArticleReadPO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ArticleReadMapper extends BaseMapper<ArticleReadPO> {
}
