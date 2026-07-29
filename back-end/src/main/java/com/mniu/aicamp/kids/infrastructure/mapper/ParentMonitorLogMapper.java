package com.mniu.aicamp.kids.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.kids.infrastructure.po.ParentMonitorLogPO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 家长监控记录 Mapper
 * 提供 parent_monitor_logs 表的基础 CRUD 操作
 */
@Mapper
public interface ParentMonitorLogMapper extends BaseMapper<ParentMonitorLogPO> {
}
