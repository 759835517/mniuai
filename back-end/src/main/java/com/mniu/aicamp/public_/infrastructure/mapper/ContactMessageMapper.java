package com.mniu.aicamp.public_.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.public_.infrastructure.po.ContactMessagePO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ContactMessageMapper extends BaseMapper<ContactMessagePO> {
}
