package com.mniu.aicamp.shared.ai;

import java.util.List;
import java.util.function.Consumer;

public interface AiClientPort {
    String chat(String systemPrompt, String userPrompt);

    default List<String> stream(String systemPrompt, String userPrompt) {
        return List.of(chat(systemPrompt, userPrompt));
    }

    default void stream(String systemPrompt, String userPrompt, Consumer<String> onToken) {
        for (String chunk : stream(systemPrompt, userPrompt)) {
            onToken.accept(chunk);
        }
    }
}
