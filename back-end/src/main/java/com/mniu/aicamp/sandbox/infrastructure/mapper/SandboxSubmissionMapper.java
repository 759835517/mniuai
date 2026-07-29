package com.mniu.aicamp.sandbox.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.sandbox.infrastructure.po.SandboxSubmissionPO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SandboxSubmissionMapper extends BaseMapper<SandboxSubmissionPO> {
}
