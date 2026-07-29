package com.mniu.aicamp.kids.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.mniu.aicamp.rag.infrastructure.typehandler.MapJsonbTypeHandler;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;

/**
 * 家长监控记录持久化对象
 * 对应表：parent_monitor_logs
 * 记录少儿用户每日学习时长与活动分类统计
 */
@Data
@TableName("parent_monitor_logs")
public class ParentMonitorLogPO {

    /** 主键 ID */
    @TableId(type = IdType.INPUT)
    private Long id;

    /** 家长用户 ID */
    private Long parentUserId;

    /** 少儿用户 ID */
    private Long childUserId;

    /** 当日学习分钟数 */
    private Integer dailyMinutes;

    /** 记录日期 */
    private LocalDate logDate;

    /** 活动分类统计 JSON，例如 {"video":30, "practice":20, "competition":10} */
    @TableField(typeHandler = MapJsonbTypeHandler.class)
    private Map<String, Object> activities;

    /** 创建时间 */
    private Instant createdAt;
}
