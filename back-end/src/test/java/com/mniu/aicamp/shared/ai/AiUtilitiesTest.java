package com.mniu.aicamp.shared.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mniu.aicamp.shared.exception.BusinessException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AiUtilitiesTest {
    @Test
    void tokenEstimatorCountsAsciiAndCjkText() {
        TokenEstimator estimator = new TokenEstimator();

        assertThat(estimator.estimate("")).isZero();
        assertThat(estimator.estimate("abcd")).isEqualTo(1);
        assertThat(estimator.estimate("AI工程师")).isEqualTo(4);
    }

    @Test
    void promptSanitizerRedactsSecretsAndControlCharacters() {
        PromptSanitizer sanitizer = new PromptSanitizer();

        String result = sanitizer.sanitize(" use sk-1234567890 and ghp_1234567890 \u0000");

        assertThat(result).doesNotContain("sk-1234567890", "ghp_1234567890", "\u0000");
        assertThat(result).contains("[REDACTED]");
        assertThat(sanitizer.sanitize(null)).isEmpty();
    }

    @Test
    void jsonExtractorReadsFencedJson() {
        AiJsonExtractor extractor = new AiJsonExtractor(new ObjectMapper());

        assertThat(extractor.extract("```json\n{\"score\":86}\n```").get("score").asInt()).isEqualTo(86);
        assertThat(extractor.extract("prefix [1,2] suffix").isArray()).isTrue();
    }

    @Test
    void jsonExtractorFailsWithBusinessError() {
        AiJsonExtractor extractor = new AiJsonExtractor(new ObjectMapper());

        assertThatThrownBy(() -> extractor.extract(null))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("empty");
        assertThatThrownBy(() -> extractor.extract("not json"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("does not contain JSON");
        assertThatThrownBy(() -> extractor.extract("{\"missing\":true"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("incomplete");
    }
}
