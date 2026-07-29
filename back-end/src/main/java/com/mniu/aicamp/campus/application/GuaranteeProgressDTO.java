package com.mniu.aicamp.campus.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/**
 * 对赌进度 DTO（5 项门槛 + 总体完成率）
 */
public record GuaranteeProgressDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long pathId,
        String pathName,
        // 5 项门槛
        Double courseCompletionPct,     // 课程完成率（目标 >= 80%）
        Integer practiceCompleted,      // 已完成练习数（目标 >= 200）
        Integer practicePassed,         // 通过练习数（目标 >= 120）
        Integer interviewRounds,        // AI面试轮数（目标 >= 10）
        Boolean resumeGenerated,        // 是否生成简历
        // 总体完成率
        Double overallPct,
        // 是否满足全部门槛
        Boolean allRequirementsMet
) {
}
