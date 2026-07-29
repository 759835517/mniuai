package com.mniu.aicamp.campus.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;
import java.time.LocalDate;

/**
 * 就业上报 DTO
 */
public record EmploymentReportDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long id,
        @JsonSerialize(using = ToStringSerializer.class) Long userId,
        String companyName,
        String position,
        String salary,
        LocalDate offerDate,
        String offerImageUrl,
        String jobType,
        String status,
        Instant reportedAt
) {}
