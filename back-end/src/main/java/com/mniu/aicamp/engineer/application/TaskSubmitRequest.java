package com.mniu.aicamp.engineer.application;

import jakarta.validation.constraints.NotBlank;

/**
 * 编程实战任务提交请求
 * <p>
 * taskId 来自 URL 路径，无需客户端传递。
 */
public record TaskSubmitRequest(
        String taskId,

        @NotBlank(message = "代码不能为空")
        String code,

        String language
) {
}
