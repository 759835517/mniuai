package com.mniu.aicamp.video.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.video.infrastructure.po.VideoHeartbeatPO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface VideoHeartbeatMapper extends BaseMapper<VideoHeartbeatPO> {
}
