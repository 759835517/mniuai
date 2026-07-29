package com.mniu.aicamp.campus.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.util.List;

/**
 * 订阅计划 DTO
 */
public record SubscriptionPlanDTO(
        String id,
        String name,
        String price,
        String period,
        boolean highlight,
        String tag,
        List<String> features
) {}
