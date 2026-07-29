package com.mniu.aicamp.engineer.application;

/**
 * 开始AI面试请求
 */
public record InterviewStartRequest(
        String type,
        String targetCompany
) {
}
