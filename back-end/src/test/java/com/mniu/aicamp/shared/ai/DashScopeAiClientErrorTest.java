package com.mniu.aicamp.shared.ai;

import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.function.Consumer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * DashScopeAiClient 错误处理单元测试。
 * 直接构造 client，不启动 Spring 上下文，验证各种异常场景。
 */
class DashScopeAiClientErrorTest {

    private DashScopeAiClient client(String apiKey) {
        return new DashScopeAiClient(
                RestClient.builder(),
                apiKey,
                "deepseek-v4-flash",
                "https://dashscope.aliyuncs.com/compatible-mode/v1",
                Duration.ofSeconds(5)
        );
    }

    @Nested
    @DisplayName("API key 校验")
    class ApiKeyValidation {

        @Test
        @DisplayName("API key 为 null 时 chat 抛出 AI_PROVIDER_ERROR")
        void nullApiKey_chat_throwsBusinessException() {
            DashScopeAiClient c = client(null);
            assertThatThrownBy(() -> c.chat("system", "user"))
                    .isInstanceOf(BusinessException.class)
                    .hasFieldOrPropertyWithValue("code", ErrorCode.AI_PROVIDER_ERROR);
        }

        @Test
        @DisplayName("API key 为空字符串时 chat 抛出 AI_PROVIDER_ERROR")
        void blankApiKey_chat_throwsBusinessException() {
            DashScopeAiClient c = client("");
            assertThatThrownBy(() -> c.chat("system", "user"))
                    .isInstanceOf(BusinessException.class)
                    .hasFieldOrPropertyWithValue("code", ErrorCode.AI_PROVIDER_ERROR);
        }

        @Test
        @DisplayName("API key 为纯空格时 chat 抛出 AI_PROVIDER_ERROR")
        void whitespaceApiKey_chat_throwsBusinessException() {
            DashScopeAiClient c = client("   ");
            assertThatThrownBy(() -> c.chat("system", "user"))
                    .isInstanceOf(BusinessException.class)
                    .hasFieldOrPropertyWithValue("code", ErrorCode.AI_PROVIDER_ERROR);
        }

        @Test
        @DisplayName("API key 为 null 时 stream 抛出 AI_PROVIDER_ERROR")
        void nullApiKey_stream_throwsBusinessException() {
            DashScopeAiClient c = client(null);
            Consumer<String> noop = s -> {};
            assertThatThrownBy(() -> c.stream("system", "user", noop))
                    .isInstanceOf(BusinessException.class)
                    .hasFieldOrPropertyWithValue("code", ErrorCode.AI_PROVIDER_ERROR);
        }
    }

    @Nested
    @DisplayName("stream 行为验证")
    class StreamBehavior {

        @Test
        @DisplayName("无 key 时 stream 不会调用 onToken")
        void noKey_stream_doesNotCallOnToken() {
            DashScopeAiClient c = client(null);
            boolean[] called = {false};
            Consumer<String> onToken = s -> called[0] = true;
            try {
                c.stream("system", "user", onToken);
            } catch (BusinessException ignored) {
            }
            assertThat(called[0]).isFalse();
        }
    }

    @Test
    @DisplayName("client 构造不依赖 Spring 上下文")
    void client_canBeConstructedWithoutSpring() {
        DashScopeAiClient c = client("test-key");
        assertThat(c).isNotNull();
    }
}
