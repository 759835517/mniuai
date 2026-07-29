package com.mniu.aicamp.pro.application;

import jakarta.validation.constraints.NotBlank;

/**
 * 会议纪要生成请求
 */
public record MeetingRequest(
        String topic,
        String participants,
        @NotBlank(message = "会议记录不能为空") String record
) {
}
