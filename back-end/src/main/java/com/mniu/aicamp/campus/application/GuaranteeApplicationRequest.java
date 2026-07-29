package com.mniu.aicamp.campus.application;

import jakarta.validation.constraints.NotBlank;

/**
 * 对赌申请请求
 */
public record GuaranteeApplicationRequest(
        @NotBlank(message = "学习路径不能为空") String pathSlug,
        String agreementVersion
) {}
