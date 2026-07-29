package com.mniu.aicamp.engineer.application;

import jakarta.validation.constraints.NotBlank;

/**
 * 算法题提交请求
 * <p>
 * problemId 来自 URL 路径，无需客户端传递。
 */
public record AlgorithmSubmitRequest(
        String problemId,

        @NotBlank(message = "代码不能为空")
        String code,

        String language
) {
}
