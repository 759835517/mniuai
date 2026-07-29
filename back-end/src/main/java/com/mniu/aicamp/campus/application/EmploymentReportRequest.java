package com.mniu.aicamp.campus.application;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

/**
 * 就业上报请求
 */
public record EmploymentReportRequest(
        @NotBlank(message = "公司名称不能为空") String companyName,
        String position,
        String salary,
        LocalDate offerDate,
        String offerImageUrl,
        String jobType
) {}
