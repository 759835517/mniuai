package com.mniu.aicamp.video.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.video.infrastructure.po.VideoProgressPO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface VideoProgressMapper extends BaseMapper<VideoProgressPO> {
}
