package com.mniu.aicamp.shared.ai;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConditionalOnProperty(name = "app.ai.provider", havingValue = "fake")
public class FakeAiClient implements AiClientPort {
    @Override
    public String chat(String systemPrompt, String userPrompt) {
        if (systemPrompt != null && systemPrompt.contains("ROADMAP_JSON")) {
            return """
                    {"tasks":[
                      {"week":1,"title":"Build Java AI service skeleton"},
                      {"week":2,"title":"Add retrieval and evaluation loop"}
                    ]}
                    """;
        }
        if (systemPrompt != null && systemPrompt.contains("PROJECT_PLAN_JSON")) {
            return """
                    {"tasks":[
                      {"title":"Design API contract","completed":true},
                      {"title":"Implement AI workflow","completed":false},
                      {"title":"Add integration tests","completed":false}
                    ]}
                    """;
        }
        if ((systemPrompt != null && systemPrompt.contains("简体中文"))
                || (userPrompt != null && userPrompt.contains("简体中文"))) {
            return "请使用简体中文输出审查意见：" + (userPrompt == null ? "" : userPrompt);
        }
        return "Here is a practical next step: " + (userPrompt == null ? "" : userPrompt);
    }

    @Override
    public List<String> stream(String systemPrompt, String userPrompt) {
        return List.of("Here is ", "a practical ", "next step: " + (userPrompt == null ? "" : userPrompt));
    }
}
