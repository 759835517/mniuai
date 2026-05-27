package com.mniu.aicamp.shared.ai;

import org.springframework.stereotype.Component;

@Component
public class PromptSanitizer {
    public String sanitize(String prompt) {
        if (prompt == null) {
            return "";
        }
        return prompt.replaceAll("(?i)(sk-[a-z0-9_-]{8,}|ghp_[a-z0-9_]{8,}|bearer\\s+[a-z0-9._-]+)", "[REDACTED]")
                .replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", "")
                .trim();
    }
}
