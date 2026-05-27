package com.mniu.aicamp.shared.ai;

public interface AiClientPort {
    String chat(String systemPrompt, String userPrompt);
}
