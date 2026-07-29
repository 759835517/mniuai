package com.mniu.aicamp.interview.infrastructure.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@TableName("mock_interviews")
@Getter
@Setter
public class MockInterviewPO {
    @TableId(type = IdType.INPUT)
    private Long id;
    private Long userId;
    private Long interviewSetId;
    private String mode;
    private String status;
    private Integer overallScore;
    private String aiSummary;
    private Instant startedAt;
    private Instant completedAt;
    private Integer durationSeconds;
}
