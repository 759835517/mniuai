package com.mniu.aicamp.edu.api;

import com.mniu.aicamp.edu.application.EduService;
import com.mniu.aicamp.edu.application.GradeRequest;
import com.mniu.aicamp.edu.application.GradeResultDTO;
import com.mniu.aicamp.edu.application.GuaranteeCheckDTO;
import com.mniu.aicamp.edu.application.LessonRequest;
import com.mniu.aicamp.edu.application.QuizQuestionDTO;
import com.mniu.aicamp.edu.application.QuizRequest;
import com.mniu.aicamp.edu.application.SlidesDTO;
import com.mniu.aicamp.edu.application.SlidesRequest;
import com.mniu.aicamp.edu.application.UsageRecordRequest;
import com.mniu.aicamp.edu.application.UsageStatsDTO;
import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.security.CurrentUsers;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Edu 教师端接口
 */
@RestController
@RequestMapping("/api/v1/edu")
public class EduController {
    private final EduService service;

    public EduController(EduService service) {
        this.service = service;
    }

    /**
     * AI 生成教案（公开）
     */
    @PostMapping("/lesson/generate")
    public ApiResponse<String> generateLesson(@Valid @RequestBody LessonRequest request) {
        return ApiResponse.ok(service.generateLesson(request));
    }

    /**
     * AI 生成题目（公开）
     */
    @PostMapping("/quiz/generate")
    public ApiResponse<List<QuizQuestionDTO>> generateQuiz(@Valid @RequestBody QuizRequest request) {
        return ApiResponse.ok(service.generateQuiz(request));
    }

    /**
     * AI 生成课件（公开）
     */
    @PostMapping("/slides/generate")
    public ApiResponse<SlidesDTO> generateSlides(@Valid @RequestBody SlidesRequest request) {
        return ApiResponse.ok(service.generateSlides(request));
    }

    /**
     * 记录使用（需登录）
     */
    @PostMapping("/usage/record")
    public ApiResponse<Void> recordUsage(@Valid @RequestBody UsageRecordRequest request) {
        Long userId = CurrentUsers.require().id();
        // TODO: 持久化使用记录
        return ApiResponse.ok(null);
    }

    /**
     * 获取使用统计（需登录）
     */
    @GetMapping("/usage/stats")
    public ApiResponse<UsageStatsDTO> getUsageStats() {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.getUsageStats(userId));
    }

    /**
     * AI 批改（公开）
     */
    @PostMapping("/grade/submit")
    public ApiResponse<GradeResultDTO> gradeSubmission(@Valid @RequestBody GradeRequest request) {
        return ApiResponse.ok(service.gradeSubmission(request));
    }

    /**
     * 获取模板列表（公开）
     */
    @GetMapping("/templates/list")
    public ApiResponse<List<String>> listTemplates() {
        // 简化版：返回模板分类列表
        return ApiResponse.ok(List.of("教案模板", "课件模板", "试题模板", "作业模板"));
    }

    /**
     * 检查对赌达成情况（需登录）
     */
    @GetMapping("/guarantee/check")
    public ApiResponse<GuaranteeCheckDTO> checkGuarantee() {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.checkGuarantee(userId));
    }

    /**
     * 申请退款（需登录）
     */
    @PostMapping("/guarantee/apply")
    public ApiResponse<String> applyGuarantee() {
        Long userId = CurrentUsers.require().id();
        // TODO: 持久化退款申请
        return ApiResponse.ok("退款申请已提交，我们将在 3 个工作日内审核");
    }
}
