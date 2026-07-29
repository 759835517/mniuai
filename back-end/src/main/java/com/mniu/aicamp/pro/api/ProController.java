package com.mniu.aicamp.pro.api;

import com.mniu.aicamp.pro.application.AssessmentRequest;
import com.mniu.aicamp.pro.application.AssessmentResultDTO;
import com.mniu.aicamp.pro.application.DataAnalysisRequest;
import com.mniu.aicamp.pro.application.DataAnalysisResultDTO;
import com.mniu.aicamp.pro.application.FeedbackRequest;
import com.mniu.aicamp.pro.application.MeetingRequest;
import com.mniu.aicamp.pro.application.MeetingResultDTO;
import com.mniu.aicamp.pro.application.ProGuaranteeDTO;
import com.mniu.aicamp.pro.application.ProService;
import com.mniu.aicamp.pro.application.ReportRequest;
import com.mniu.aicamp.pro.application.ReportResultDTO;
import com.mniu.aicamp.pro.application.ResumeRequest;
import com.mniu.aicamp.pro.application.ResumeResultDTO;
import com.mniu.aicamp.pro.application.WritingRequest;
import com.mniu.aicamp.pro.application.WritingResultDTO;
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
 * Pro 职场赋能端接口
 */
@RestController
@RequestMapping("/api/v1/pro")
public class ProController {
    private final ProService service;

    public ProController(ProService service) {
        this.service = service;
    }

    /**
     * AI 生成文档（公开）
     */
    @PostMapping("/writing/generate")
    public ApiResponse<WritingResultDTO> generateDocument(@Valid @RequestBody WritingRequest request) {
        return ApiResponse.ok(service.generateDocument(request));
    }

    /**
     * AI 生成会议纪要（公开）
     */
    @PostMapping("/meeting/generate")
    public ApiResponse<MeetingResultDTO> generateMeetingMinutes(@Valid @RequestBody MeetingRequest request) {
        return ApiResponse.ok(service.generateMeetingMinutes(request));
    }

    /**
     * AI 数据分析（公开）
     */
    @PostMapping("/data-analysis/query")
    public ApiResponse<DataAnalysisResultDTO> analyzeData(@Valid @RequestBody DataAnalysisRequest request) {
        return ApiResponse.ok(service.analyzeData(request));
    }

    /**
     * AI 简历优化（公开）
     */
    @PostMapping("/resume/analyze")
    public ApiResponse<ResumeResultDTO> analyzeResume(@Valid @RequestBody ResumeRequest request) {
        return ApiResponse.ok(service.analyzeResume(request));
    }

    /**
     * AI 生成汇报材料（公开）
     */
    @PostMapping("/report/generate")
    public ApiResponse<ReportResultDTO> generateReport(@Valid @RequestBody ReportRequest request) {
        return ApiResponse.ok(service.generateReport(request));
    }

    /**
     * 能力诊断提交（公开）
     */
    @PostMapping("/assessment")
    public ApiResponse<AssessmentResultDTO> submitAssessment(@Valid @RequestBody AssessmentRequest request) {
        return ApiResponse.ok(service.evaluateAssessment(request));
    }

    /**
     * 查询对赌进度（需登录）
     */
    @GetMapping("/guarantee/progress")
    public ApiResponse<ProGuaranteeDTO> getGuaranteeProgress() {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.getGuaranteeProgress(userId));
    }

    /**
     * 申请退款（需登录）
     */
    @PostMapping("/guarantee/apply")
    public ApiResponse<String> applyGuarantee() {
        Long userId = CurrentUsers.require().id();
        // TODO: 持久化退款申请
        return ApiResponse.ok("退款申请已提交，我们将在 1 个工作日内审核");
    }

    /**
     * 获取模板列表（公开）
     */
    @GetMapping("/templates")
    public ApiResponse<List<String>> listTemplates() {
        return ApiResponse.ok(List.of("PRD模板", "周报模板", "会议纪要模板", "商务邮件模板", "项目方案模板"));
    }

    /**
     * 工具使用评分（需登录）
     */
    @PostMapping("/feedback")
    public ApiResponse<Void> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        Long userId = CurrentUsers.require().id();
        // TODO: 持久化评分
        return ApiResponse.ok(null);
    }
}
