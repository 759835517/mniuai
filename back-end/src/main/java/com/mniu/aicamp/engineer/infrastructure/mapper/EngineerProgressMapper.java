package com.mniu.aicamp.engineer.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.engineer.infrastructure.po.EngineerProgressPO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.Map;

/**
 * 程序员学习进度Mapper
 */
@Mapper
public interface EngineerProgressMapper extends BaseMapper<EngineerProgressPO> {

    /**
     * 原子递增指定字段（+1）
     */
    @Update("UPDATE engineer_progress SET ${field} = ${field} + 1, updated_at = now() WHERE user_id = #{userId}")
    int incrementField(@Param("userId") Long userId, @Param("field") String field);

    /**
     * 确保用户有进度记录（不存在则插入）
     */
    @Update("INSERT INTO engineer_progress (id, user_id, solved_problems, completed_tasks, interview_rounds, system_design_count, code_review_count, job_applications, updated_at) " +
            "VALUES (#{id}, #{userId}, 0, 0, 0, 0, 0, 0, now()) " +
            "ON CONFLICT (user_id) DO NOTHING")
    int ensureExists(@Param("id") Long id, @Param("userId") Long userId);

    /**
     * 查询 users 表中第一个用户（用于演示模式）
     */
    @Select("SELECT id AS user_id FROM users ORDER BY created_at ASC LIMIT 1")
    Map<String, Object> findFirstUser();
}
