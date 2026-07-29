package com.mniu.aicamp.kids.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

/**
 * 竞赛题目持久化对象
 * 对应表：competition_problems
 * 存储 CSP/NOI/蓝桥杯等青少年编程竞赛真题与模拟题
 */
@Data
@TableName("competition_problems")
public class CompetitionProblemPO {

    /** 主键 ID */
    @TableId(type = IdType.INPUT)
    private Long id;

    /** URL 友好唯一标识 */
    private String slug;

    /** 题目标题 */
    private String title;

    /** 难度：PRIMARY(小学) / JUNIOR(初中) / SENIOR(高中) */
    private String difficulty;

    /** 竞赛类别：CSP / NOI / BLUE_BRIDGE / CODING_CONTEST */
    private String category;

    /** 题目描述（Markdown 格式） */
    private String content;

    /** 输入格式说明 */
    private String inputFormat;

    /** 输出格式说明 */
    private String outputFormat;

    /** 样例输入 */
    private String sampleInput;

    /** 样例输出 */
    private String sampleOutput;

    /** 提示（少儿友好） */
    private String hint;

    /** 时间限制（毫秒） */
    private Integer timeLimitMs;

    /** 内存限制（MB） */
    private Integer memoryLimitMb;

    /** 排序权重 */
    private Integer sortOrder;

    /** 状态：PUBLISHED / DRAFT */
    private String status;

    /** 创建时间 */
    private Instant createdAt;
}
