package com.mniu.aicamp.engineer.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

/**
 * 算法题库PO
 */
@Data
@TableName("algorithm_questions")
public class AlgorithmQuestionPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private String title;
    private String difficulty;
    private String category;
    private String acceptance;
    private String description;
    private Integer sortOrder;
    private String status;
    private Instant createdAt;
}
