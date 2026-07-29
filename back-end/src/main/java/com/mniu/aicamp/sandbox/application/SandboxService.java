package com.mniu.aicamp.sandbox.application;

import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import com.mniu.aicamp.sandbox.infrastructure.mapper.SandboxSubmissionMapper;
import com.mniu.aicamp.sandbox.infrastructure.po.SandboxSubmissionPO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class SandboxService {

    private static final int MAX_SOURCE_CODE_BYTES = 65536; // 64 KB

    private final Judge0Client judge0Client;
    private final SandboxSubmissionMapper submissionMapper;
    private final SnowflakeIdGenerator idGenerator;

    public SandboxService(Judge0Client judge0Client,
                          SandboxSubmissionMapper submissionMapper,
                          SnowflakeIdGenerator idGenerator) {
        this.judge0Client = judge0Client;
        this.submissionMapper = submissionMapper;
        this.idGenerator = idGenerator;
    }

    /**
     * 执行代码并持久化结果。
     */
    @Transactional
    public CodeExecutionResult execute(Long userId, CodeExecutionRequest request) {
        validateRequest(request);

        // 1. 持久化初始记录
        SandboxSubmissionPO po = new SandboxSubmissionPO();
        po.setId(idGenerator.nextId());
        po.setUserId(userId);
        po.setLessonId(request.lessonId());
        po.setLanguageId(request.languageId());
        po.setSourceCode(request.sourceCode());
        po.setStdin(request.stdin());
        po.setExpectedOutput(request.expectedOutput());
        po.setStatus("PROCESSING");
        po.setCreatedAt(Instant.now());
        submissionMapper.insert(po);

        try {
            // 2. 调用 Judge0
            Judge0Client.SubmitResult result = judge0Client.submitAndWait(
                    request.languageId(),
                    request.sourceCode(),
                    request.stdin(),
                    request.expectedOutput(),
                    request.timeLimitSec(),
                    request.memoryLimitMb()
            );

            // 3. 映射状态
            String status = mapJudge0Status(result.statusDescription());

            // 4. 更新记录
            po.setToken(result.token());
            po.setActualOutput(result.stdout());
            po.setStatus(status);
            po.setTimeMs(result.timeSec() != null
                    ? java.math.BigDecimal.valueOf(result.timeSec() * 1000) : null);
            po.setMemoryKb(result.memoryKb());
            submissionMapper.updateById(po);

            return new CodeExecutionResult(po.getId(), status, result.stdout(),
                    result.timeSec() != null ? result.timeSec() * 1000 : null,
                    result.memoryKb());
        } catch (Exception ex) {
            po.setStatus("INTERNAL_ERROR");
            submissionMapper.updateById(po);
            throw ex;
        }
    }

    /**
     * 查询提交记录。
     */
    public CodeExecutionResult getSubmission(Long userId, Long submissionId) {
        SandboxSubmissionPO po = submissionMapper.selectById(submissionId);
        if (po == null) {
            return null;
        }
        return new CodeExecutionResult(po.getId(), po.getStatus(), po.getActualOutput(),
                po.getTimeMs() != null ? po.getTimeMs().doubleValue() : null,
                po.getMemoryKb());
    }

    private void validateRequest(CodeExecutionRequest request) {
        if (request.sourceCode() != null
                && request.sourceCode().getBytes().length > MAX_SOURCE_CODE_BYTES) {
            throw new com.mniu.aicamp.shared.exception.BusinessException(
                    com.mniu.aicamp.shared.api.ErrorCode.CODE_TOO_LARGE,
                    "Source code exceeds 64 KB limit");
        }
    }

    /**
     * 将 Judge0 状态描述映射为内部状态。
     */
    private String mapJudge0Status(String description) {
        if (description == null) return "INTERNAL_ERROR";
        return switch (description) {
            case "Accepted" -> "ACCEPTED";
            case "Wrong Answer" -> "WRONG_ANSWER";
            case "Time Limit Exceeded" -> "TIME_LIMIT_EXCEEDED";
            case "Compilation Error" -> "COMPILATION_ERROR";
            case "Runtime Error (SIGSEGV)", "Runtime Error (SIGXFSZ)",
                 "Runtime Error (SIGFPE)", "Runtime Error (SIGABRT)",
                 "Runtime Error (NZEC)", "Runtime Error (Other)" -> "RUNTIME_ERROR";
            case "Internal Error" -> "INTERNAL_ERROR";
            case "In Queue" -> "IN_QUEUE";
            case "Processing" -> "PROCESSING";
            default -> "INTERNAL_ERROR";
        };
    }
}
