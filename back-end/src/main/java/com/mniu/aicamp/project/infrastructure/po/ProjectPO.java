package com.mniu.aicamp.project.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/** projects table. Stores AI project plans created by users. */
@TableName("projects")
@Getter
@Setter
public class ProjectPO {
    /** Primary key: project id. */
    @TableId(type = IdType.INPUT)
    private Long id;
    /** Owner user id. */
    private Long userId;
    /** Project name. */
    private String name;
    /** Project type such as RAG, AGENT, AI_SAAS or MCP_SERVER. */
    private String type;
    /** Project lifecycle status. */
    private String status;
    /** Row creation time. */
    private Instant createdAt;
}
