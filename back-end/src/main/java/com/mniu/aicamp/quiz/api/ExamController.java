package com.mniu.aicamp.quiz.api;

import com.mniu.aicamp.quiz.application.Exam;
import com.mniu.aicamp.quiz.application.ExamGenerateRequest;
import com.mniu.aicamp.quiz.application.ExamQuestion;
import com.mniu.aicamp.quiz.application.ExamRecord;
import com.mniu.aicamp.quiz.application.ExamService;
import com.mniu.aicamp.quiz.application.ExamSubmitRequest;
import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.api.PageResponse;
import com.mniu.aicamp.shared.security.CurrentUsers;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class ExamController {
    private final ExamService service;

    public ExamController(ExamService service) {
        this.service = service;
    }

    // ========== 测验管理（管理端） ==========

    @PostMapping("/admin/exams/generate")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<List<Exam>> generateExams(@Valid @RequestBody ExamGenerateRequest request) {
        return ApiResponse.ok(service.generateExams(request.roadmapId()));
    }

    // ========== 测验查询 ==========

    @GetMapping("/exams/roadmap/{roadmapId}")
    ApiResponse<List<Exam>> listByRoadmap(@PathVariable Long roadmapId) {
        return ApiResponse.ok(service.listByRoadmap(roadmapId));
    }

    @GetMapping("/exams/{examId}")
    ApiResponse<Exam> getExam(@PathVariable Long examId) {
        return ApiResponse.ok(service.getExam(examId));
    }

    @GetMapping("/exams/{examId}/questions")
    ApiResponse<List<ExamQuestion>> getQuestions(@PathVariable Long examId) {
        return ApiResponse.ok(service.getQuestions(examId));
    }

    // ========== 考试流程 ==========

    @PostMapping("/exams/{examId}/start")
    ApiResponse<ExamRecord> startExam(@PathVariable Long examId) {
        return ApiResponse.ok(service.startExam(CurrentUsers.require().id(), examId));
    }

    @PostMapping("/exams/{examId}/submit")
    ApiResponse<ExamRecord> submitExam(@PathVariable Long examId, @Valid @RequestBody ExamSubmitRequest request) {
        return ApiResponse.ok(service.submitExam(CurrentUsers.require().id(), examId, request));
    }

    // ========== 考试记录 ==========

    @GetMapping("/exam-records/my")
    ApiResponse<PageResponse<ExamRecord>> listMyRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(service.listMyRecords(CurrentUsers.require().id(), page, size));
    }

    @GetMapping("/exam-records/{recordId}")
    ApiResponse<ExamRecord> getRecord(@PathVariable Long recordId) {
        return ApiResponse.ok(service.getRecord(CurrentUsers.require().id(), recordId));
    }

    // ========== 掌握程度 ==========

    @GetMapping("/roadmaps/{roadmapId}/mastery")
    ApiResponse<Map<String, Object>> getMastery(@PathVariable Long roadmapId) {
        return ApiResponse.ok(service.getMastery(roadmapId));
    }
}
