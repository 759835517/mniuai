package com.mniu.aicamp.sandbox.application;

import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import com.mniu.aicamp.sandbox.infrastructure.mapper.SandboxSubmissionMapper;
import com.mniu.aicamp.sandbox.infrastructure.po.SandboxSubmissionPO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.ArgumentCaptor;
import org.mockito.ArgumentMatcher;

import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

/**
 * SandboxService 单元测试。
 * 使用 Mockito 模拟 Judge0Client 和 Mapper，验证业务编排逻辑。
 */
class SandboxServiceTest {

    private Judge0Client judge0Client;
    private SandboxSubmissionMapper submissionMapper;
    private SnowflakeIdGenerator idGenerator;
    private SandboxService sandboxService;

    @BeforeEach
    void setUp() {
        judge0Client = mock(Judge0Client.class);
        submissionMapper = mock(SandboxSubmissionMapper.class);
        idGenerator = mock(SnowflakeIdGenerator.class);
        sandboxService = new SandboxService(judge0Client, submissionMapper, idGenerator);
        when(idGenerator.nextId()).thenReturn(12345L);
    }

    @Nested
    @DisplayName("execute 成功场景")
    class ExecuteSuccess {

        @Test
        @DisplayName("Accepted 状态返回正确结果")
        void accepted_returnsCorrectResult() {
            CodeExecutionRequest request = new CodeExecutionRequest(
                    71, "print('hello')", null, null, null, 5, 256);
            Judge0Client.SubmitResult judge0Result = new Judge0Client.SubmitResult(
                    "token-abc", "Accepted", "hello\n", null, 0.123, 12288);
            when(judge0Client.submitAndWait(anyInt(), any(), any(), any(), anyInt(), anyInt()))
                    .thenReturn(judge0Result);

            CodeExecutionResult result = sandboxService.execute(1L, request);

            assertThat(result.status()).isEqualTo("ACCEPTED");
            assertThat(result.actualOutput()).isEqualTo("hello\n");
            assertThat(result.timeMs()).isEqualTo(123.0);
            assertThat(result.memoryKb()).isEqualTo(12288);
            assertThat(result.submissionId()).isEqualTo(12345L);

            verify(submissionMapper).insert(any(SandboxSubmissionPO.class));
            verify(submissionMapper).updateById(any(SandboxSubmissionPO.class));
        }

        @Test
        @DisplayName("Wrong Answer 映射为 WRONG_ANSWER")
        void wrongAnswer_mapsToWrongAnswer() {
            CodeExecutionRequest request = new CodeExecutionRequest(
                    71, "print('wrong')", null, "expected", null, 5, 256);
            Judge0Client.SubmitResult judge0Result = new Judge0Client.SubmitResult(
                    "token", "Wrong Answer", "wrong\n", null, 0.05, 10240);
            when(judge0Client.submitAndWait(anyInt(), any(), any(), any(), anyInt(), anyInt()))
                    .thenReturn(judge0Result);

            CodeExecutionResult result = sandboxService.execute(1L, request);

            assertThat(result.status()).isEqualTo("WRONG_ANSWER");
        }

        @Test
        @DisplayName("Time Limit Exceeded 映射为 TIME_LIMIT_EXCEEDED")
        void timeLimitExceeded_mapsCorrectly() {
            CodeExecutionRequest request = new CodeExecutionRequest(
                    71, "while True: pass", null, null, null, 1, 256);
            Judge0Client.SubmitResult judge0Result = new Judge0Client.SubmitResult(
                    "token", "Time Limit Exceeded", "", null, 1.0, 10240);
            when(judge0Client.submitAndWait(anyInt(), any(), any(), any(), anyInt(), anyInt()))
                    .thenReturn(judge0Result);

            CodeExecutionResult result = sandboxService.execute(1L, request);

            assertThat(result.status()).isEqualTo("TIME_LIMIT_EXCEEDED");
        }

        @Test
        @DisplayName("初始记录包含正确字段，最终状态为 ACCEPTED 并包含 token")
        void initialRecord_hasCorrectFields_finalRecordAccepted() {
            CodeExecutionRequest request = new CodeExecutionRequest(
                    71, "pass", null, null, 999L, 5, 256);
            Judge0Client.SubmitResult judge0Result = new Judge0Client.SubmitResult(
                    "my-token", "Accepted", "", null, 0.01, 10240);
            when(judge0Client.submitAndWait(anyInt(), any(), any(), any(), anyInt(), anyInt()))
                    .thenReturn(judge0Result);

            sandboxService.execute(42L, request);

            // 验证 insert 时的初始记录
            ArgumentCaptor<SandboxSubmissionPO> captor = ArgumentCaptor.forClass(SandboxSubmissionPO.class);
            verify(submissionMapper).insert(captor.capture());
            SandboxSubmissionPO initial = captor.getValue();
            assertThat(initial.getUserId()).isEqualTo(42L);
            assertThat(initial.getLessonId()).isEqualTo(999L);
            assertThat(initial.getLanguageId()).isEqualTo(71);
            assertThat(initial.getSourceCode()).isEqualTo("pass");

            // 验证 updateById 被调用（最终状态由 SandboxService 内部更新同一个 po 对象）
            verify(submissionMapper).updateById(any(SandboxSubmissionPO.class));
        }
    }

    @Nested
    @DisplayName("execute 失败场景")
    class ExecuteFailure {

        @Test
        @DisplayName("Judge0 异常时记录状态更新为 INTERNAL_ERROR")
        void judge0Exception_setsInternalError() {
            CodeExecutionRequest request = new CodeExecutionRequest(
                    71, "print('hi')", null, null, null, 5, 256);
            when(judge0Client.submitAndWait(anyInt(), any(), any(), any(), anyInt(), anyInt()))
                    .thenThrow(new BusinessException(ErrorCode.CODE_EXECUTION_ERROR, "connection refused"));

            assertThatThrownBy(() -> sandboxService.execute(1L, request))
                    .isInstanceOf(BusinessException.class);

            ArgumentCaptor<SandboxSubmissionPO> captor = ArgumentCaptor.forClass(SandboxSubmissionPO.class);
            verify(submissionMapper, atLeastOnce()).updateById(captor.capture());
            SandboxSubmissionPO updated = captor.getValue();
            assertThat(updated.getStatus()).isEqualTo("INTERNAL_ERROR");
        }
    }

    @Nested
    @DisplayName("请求校验")
    class RequestValidation {

        @Test
        @DisplayName("源代码超过 64KB 抛出 CODE_TOO_LARGE")
        void oversizedSourceCode_throwsCodeTooLarge() {
            String largeCode = "a".repeat(70000);
            CodeExecutionRequest request = new CodeExecutionRequest(
                    71, largeCode, null, null, null, 5, 256);

            assertThatThrownBy(() -> sandboxService.execute(1L, request))
                    .isInstanceOf(BusinessException.class)
                    .hasFieldOrPropertyWithValue("code", ErrorCode.CODE_TOO_LARGE);

            verify(judge0Client, never()).submitAndWait(anyInt(), any(), any(), any(), anyInt(), anyInt());
        }

        @Test
        @DisplayName("默认 timeLimitSec=5, memoryLimitMb=256")
        void defaultLimits_areApplied() {
            CodeExecutionRequest request = new CodeExecutionRequest(
                    71, "pass", null, null, null, null, null);
            Judge0Client.SubmitResult judge0Result = new Judge0Client.SubmitResult(
                    "token", "Accepted", "", null, 0.01, 10240);
            when(judge0Client.submitAndWait(anyInt(), any(), any(), any(), anyInt(), anyInt()))
                    .thenReturn(judge0Result);

            sandboxService.execute(1L, request);

            verify(judge0Client).submitAndWait(eq(71), any(), any(), any(), eq(5), eq(256));
        }
    }

    @Nested
    @DisplayName("getSubmission 查询")
    class GetSubmission {

        @Test
        @DisplayName("存在的记录返回结果")
        void existingSubmission_returnsResult() {
            SandboxSubmissionPO po = new SandboxSubmissionPO();
            po.setId(100L);
            po.setUserId(1L);
            po.setStatus("ACCEPTED");
            po.setActualOutput("hello\n");
            po.setTimeMs(java.math.BigDecimal.valueOf(123.0));
            po.setMemoryKb(12288);
            when(submissionMapper.selectById(100L)).thenReturn(po);

            CodeExecutionResult result = sandboxService.getSubmission(1L, 100L);

            assertThat(result).isNotNull();
            assertThat(result.submissionId()).isEqualTo(100L);
            assertThat(result.status()).isEqualTo("ACCEPTED");
            assertThat(result.actualOutput()).isEqualTo("hello\n");
        }

        @Test
        @DisplayName("不存在的记录返回 null")
        void nonExistentSubmission_returnsNull() {
            when(submissionMapper.selectById(999L)).thenReturn(null);

            CodeExecutionResult result = sandboxService.getSubmission(1L, 999L);

            assertThat(result).isNull();
        }
    }

    @Nested
    @DisplayName("状态映射")
    class StatusMapping {

        @ParameterizedTest
        @MethodSource("statusProvider")
        @DisplayName("各种 Judge0 状态正确映射")
        void judge0Status_mapsCorrectly(String judge0Status, String expectedInternal) {
            CodeExecutionRequest request = new CodeExecutionRequest(
                    71, "code", null, null, null, 5, 256);
            Judge0Client.SubmitResult judge0Result = new Judge0Client.SubmitResult(
                    "token", judge0Status, "", null, 0.01, 10240);
            when(judge0Client.submitAndWait(anyInt(), any(), any(), any(), anyInt(), anyInt()))
                    .thenReturn(judge0Result);

            CodeExecutionResult result = sandboxService.execute(1L, request);

            assertThat(result.status()).isEqualTo(expectedInternal);
        }

        static Stream<Arguments> statusProvider() {
            return Stream.of(
                    Arguments.of("Accepted", "ACCEPTED"),
                    Arguments.of("Wrong Answer", "WRONG_ANSWER"),
                    Arguments.of("Time Limit Exceeded", "TIME_LIMIT_EXCEEDED"),
                    Arguments.of("Compilation Error", "COMPILATION_ERROR"),
                    Arguments.of("Runtime Error (SIGSEGV)", "RUNTIME_ERROR"),
                    Arguments.of("Runtime Error (NZEC)", "RUNTIME_ERROR"),
                    Arguments.of("In Queue", "IN_QUEUE"),
                    Arguments.of("Processing", "PROCESSING")
            );
        }
    }

}
