package com.mniu.aicamp.sandbox.api;

import com.mniu.aicamp.sandbox.application.CodeExecutionRequest;
import com.mniu.aicamp.sandbox.application.CodeExecutionResult;
import com.mniu.aicamp.sandbox.application.SandboxService;
import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import com.mniu.aicamp.shared.security.CurrentUsers;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/sandbox")
public class SandboxController {

    private final SandboxService sandboxService;

    public SandboxController(SandboxService sandboxService) {
        this.sandboxService = sandboxService;
    }

    /**
     * 执行代码。
     */
    @PostMapping("/execute")
    ApiResponse<CodeExecutionResult> execute(@Valid @RequestBody CodeExecutionRequest request) {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(sandboxService.execute(userId, request));
    }

    /**
     * 查询提交记录。
     */
    @GetMapping("/submissions/{id}")
    ApiResponse<CodeExecutionResult> getSubmission(@PathVariable Long id) {
        Long userId = CurrentUsers.require().id();
        CodeExecutionResult result = sandboxService.getSubmission(userId, id);
        if (result == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Submission not found");
        }
        return ApiResponse.ok(result);
    }
}
