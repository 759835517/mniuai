package com.mniu.aicamp.shared.ai;

import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * AiClientPort 条件装配切换验证。
 * 通过 app.ai.provider 控制装配哪个实现。
 *
 * 注意：IntegrationTestBase 默认设置 app.ai.provider=fake，
 * 所以默认情况下应装配 FakeAiClient。
 */
@SpringBootTest(properties = {
        "app.ai.provider=fake",
        "app.repository.provider=fake",
        "spring.ai.dashscope.api-key=test-key",
        "app.interview.seed-enabled=false",
        "app.article.seed-enabled=false"
})
class AiClientSwitchTest {

    @Autowired
    private AiClientPort aiClient;

    @Test
    @DisplayName("provider=fake 时应装配 FakeAiClient")
    void fakeProvider_assemblesFakeClient() {
        assertThat(aiClient).isInstanceOf(FakeAiClient.class);
    }

    @Test
    @DisplayName("FakeAiClient.chat 对 ROADMAP_JSON 返回含 tasks 的 JSON")
    void fakeChat_roadmapJson_containsTasks() {
        String result = aiClient.chat("ROADMAP_JSON", "生成路线图");
        assertThat(result).contains("tasks");
    }

    @Test
    @DisplayName("FakeAiClient.chat 对 PROJECT_PLAN_JSON 返回含 tasks 的 JSON")
    void fakeChat_projectPlanJson_containsTasks() {
        String result = aiClient.chat("PROJECT_PLAN_JSON", "生成项目计划");
        assertThat(result).contains("tasks");
    }

    @Test
    @DisplayName("FakeAiClient.chat 对简体中文请求返回中文内容")
    void fakeChat_chineseRequest_returnsChinese() {
        String result = aiClient.chat("简体中文", "写一段代码");
        assertThat(result).contains("简体中文");
    }

    @Test
    @DisplayName("FakeAiClient.stream 返回分块列表")
    void fakeStream_returnsChunks() {
        java.util.List<String> chunks = aiClient.stream("system", "next step");
        assertThat(chunks).isNotEmpty();
        assertThat(String.join("", chunks)).isNotBlank();
    }

    @Test
    @DisplayName("FakeAiClient.stream(onToken) 逐 token 回调")
    void fakeStream_onToken_calledPerChunk() {
        java.util.List<String> collected = new java.util.ArrayList<>();
        aiClient.stream("system", "next step", collected::add);
        assertThat(collected).isNotEmpty();
    }
}

/**
 * 验证 DashScope provider 在无 key 时抛出正确异常。
 * 使用独立配置类避免影响其他测试。
 */
@SpringBootTest(properties = {
        "app.ai.provider=dashscope",
        "app.repository.provider=fake",
        "spring.ai.dashscope.api-key:",
        "app.interview.seed-enabled=false",
        "app.article.seed-enabled=false"
})
@DisplayName("DashScope provider 无 key 时")
class AiClientSwitchTest_DashScopeNoKey {

    @Autowired
    private AiClientPort aiClient;

    @Test
    @DisplayName("应装配 DashScopeAiClient")
    void dashscopeProvider_assemblesDashScopeClient() {
        assertThat(aiClient).isInstanceOf(DashScopeAiClient.class);
    }

    @Test
    @DisplayName("chat 空 key 抛出 AI_PROVIDER_ERROR")
    void chat_emptyKey_throwsBusinessException() {
        assertThatThrownBy(() -> aiClient.chat("system", "user"))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("code", ErrorCode.AI_PROVIDER_ERROR);
    }
}
