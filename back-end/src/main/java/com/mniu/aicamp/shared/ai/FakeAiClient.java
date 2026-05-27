package com.mniu.aicamp.shared.ai;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.ai.provider", havingValue = "fake")
public class FakeAiClient implements AiClientPort {
    @Override
    public String chat(String systemPrompt, String userPrompt) {
        return "Here is a practical next step: " + (userPrompt == null ? "" : userPrompt);
    }
}
