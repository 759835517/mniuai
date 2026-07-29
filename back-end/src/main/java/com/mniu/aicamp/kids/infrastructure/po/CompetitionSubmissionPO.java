package com.mniu.aicamp.kids.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

/**
 * 竞赛代码提交记录持久化对象
 * 对应表：competition_submissions
 * 记录少儿用户在竞赛题目上的代码提交与评测结果
 */
@Data
@TableName("competition_submissions")
public class CompetitionSubmissionPO {

    /** 主键 ID */
    @TableId(type = IdType.INPUT)
    private Long id;

    /** 用户 ID */
    private Long userId;

    /** 题目 ID */
    private Long problemId;

    /** 编程语言 */
    private String language;

    /** 源代码 */
    private String sourceCode;

    /** 评测状态：PENDING / ACCEPTED / WRONG_ANSWER / TIME_LIMIT_EXCEEDED 等 */
    private String status;

    /** 通过测试用例数 */
    private Integer passedCount;

    /** 总测试用例数 */
    private Integer totalCount;

    /** 运行时间（毫秒） */
    private Integer runtimeMs;

    /** 内存消耗（KB） */
    private Integer memoryKb;

    /** 提交时间 */
    private Instant submittedAt;
}
