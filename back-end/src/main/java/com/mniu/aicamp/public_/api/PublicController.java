package com.mniu.aicamp.public_.api;

import com.mniu.aicamp.public_.application.ContactRequest;
import com.mniu.aicamp.public_.application.ContactMessage;
import com.mniu.aicamp.public_.application.PublicCourseDTO;
import com.mniu.aicamp.public_.application.PublicService;
import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.api.PageResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 官网公开接口（无需登录）
 */
@RestController
@RequestMapping("/api/v1/public")
public class PublicController {
    private final PublicService service;

    public PublicController(PublicService service) {
        this.service = service;
    }

    /**
     * 公开课程列表
     */
    @GetMapping("/courses")
    public ApiResponse<PageResponse<PublicCourseDTO>> listCourses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(service.listCourses(category, difficulty, page, size));
    }

    /**
     * 公开课程详情
     */
    @GetMapping("/courses/{id}")
    public ApiResponse<PublicCourseDTO> getCourse(@PathVariable Long id) {
        PublicCourseDTO course = service.getCourse(id);
        if (course == null) {
            return ApiResponse.error("COURSE_NOT_FOUND", "Course not found");
        }
        return ApiResponse.ok(course);
    }

    /**
     * 提交联系表单
     */
    @PostMapping("/contact")
    public ApiResponse<ContactMessage> submitContact(@Valid @RequestBody ContactRequest request) {
        return ApiResponse.ok(service.submitContact(request));
    }
}
