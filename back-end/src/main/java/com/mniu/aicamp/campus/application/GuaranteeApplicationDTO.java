package com.mniu.aicamp.campus.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;

/**
 * 对赌申请 DTO
 */
public record GuaranteeApplicationDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long id,
        @JsonSerialize(using = ToStringSerializer.class) Long userId,
        String pathSlug,
        String pathName,
        String status,
        String agreementVersion,
        Instant appliedAt,
        Instant expiresAt
) {}
