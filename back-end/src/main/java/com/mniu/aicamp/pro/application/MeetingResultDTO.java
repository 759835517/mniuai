package com.mniu.aicamp.pro.application;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;

/**
 * 会议纪要生成结果
 */
public record MeetingResultDTO(
        @JsonSerialize(using = ToStringSerializer.class) Long id,
        String topic,
        String participants,
        String minutes,
        Instant createdAt
) {
}
