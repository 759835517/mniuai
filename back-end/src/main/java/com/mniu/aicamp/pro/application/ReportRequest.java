package com.mniu.aicamp.pro.application;

import jakarta.validation.constraints.NotBlank;

/**
 * 汇报材料生成请求
 */
public record ReportRequest(
        @NotBlank(message = "汇报类型不能为空") String reportType,
        @NotBlank(message = "工作内容不能为空") String content
) {
}
