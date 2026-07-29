package com.mniu.aicamp.engineer.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mniu.aicamp.engineer.infrastructure.po.AlgorithmQuestionPO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 算法题库Mapper
 */
@Mapper
public interface AlgorithmQuestionMapper extends BaseMapper<AlgorithmQuestionPO> {

    /**
     * 分页查询算法题（支持按难度和分类筛选）
     */
    @Select("<script>" +
            "SELECT id, title, difficulty, category, acceptance, description, sort_order, status, created_at " +
            "FROM algorithm_questions " +
            "WHERE status = 'ACTIVE' " +
            "<if test='difficulty != null and difficulty != \"\"'> AND difficulty = #{difficulty} </if> " +
            "<if test='category != null and category != \"\"'> AND category = #{category} </if> " +
            "ORDER BY sort_order ASC " +
            "LIMIT #{limit} OFFSET #{offset}" +
            "</script>")
    List<AlgorithmQuestionPO> selectPage(@Param("difficulty") String difficulty,
                                         @Param("category") String category,
                                         @Param("limit") int limit,
                                         @Param("offset") int offset);

    /**
     * 统计符合条件的题目数量
     */
    @Select("<script>" +
            "SELECT COUNT(*) FROM algorithm_questions " +
            "WHERE status = 'ACTIVE' " +
            "<if test='difficulty != null and difficulty != \"\"'> AND difficulty = #{difficulty} </if> " +
            "<if test='category != null and category != \"\"'> AND category = #{category} </if> " +
            "</script>")
    int countByCondition(@Param("difficulty") String difficulty,
                         @Param("category") String category);
}
