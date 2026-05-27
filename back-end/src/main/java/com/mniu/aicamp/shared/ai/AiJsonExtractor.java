package com.mniu.aicamp.shared.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import org.springframework.stereotype.Component;
@Component
public class AiJsonExtractor {
    private final ObjectMapper objectMapper;

    public AiJsonExtractor(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public JsonNode extract(String content) {
        if (content == null) {
            throw new BusinessException(ErrorCode.AI_JSON_PARSE_FAILED, "AI response is empty");
        }
        String json = stripFence(content.trim());
        int objectStart = json.indexOf('{');
        int arrayStart = json.indexOf('[');
        int start = objectStart >= 0 && (arrayStart < 0 || objectStart < arrayStart) ? objectStart : arrayStart;
        if (start < 0) {
            throw new BusinessException(ErrorCode.AI_JSON_PARSE_FAILED, "AI response does not contain JSON");
        }
        int end = json.charAt(start) == '{' ? json.lastIndexOf('}') : json.lastIndexOf(']');
        if (end < start) {
            throw new BusinessException(ErrorCode.AI_JSON_PARSE_FAILED, "AI response JSON is incomplete");
        }
        try {
            return objectMapper.readTree(json.substring(start, end + 1));
        } catch (Exception ex) {
            throw new BusinessException(ErrorCode.AI_JSON_PARSE_FAILED, "AI response JSON is invalid");
        }
    }

    private String stripFence(String value) {
        return value.replaceFirst("(?s)^```(?:json)?\\s*", "").replaceFirst("(?s)\\s*```$", "");
    }
}
