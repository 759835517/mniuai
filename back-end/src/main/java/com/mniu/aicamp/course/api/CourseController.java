package com.mniu.aicamp.course.api;

import com.mniu.aicamp.course.application.CourseDetail;
import com.mniu.aicamp.course.application.CourseProgress;
import com.mniu.aicamp.course.application.CourseService;
import com.mniu.aicamp.course.application.CourseSummary;
import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.api.PageResponse;
import com.mniu.aicamp.shared.security.CurrentUsers;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {
    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    @GetMapping
    ApiResponse<PageResponse<CourseSummary>> list(@RequestParam(required = false) String category,
                                                  @RequestParam(required = false) String difficulty,
                                                  @RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(service.listCourses(category, difficulty, page, size));
    }

    @GetMapping("/{id}")
    ApiResponse<CourseDetail> detail(@PathVariable Long id) {
        return ApiResponse.ok(service.getCourse(CurrentUsers.require().id(), id));
    }

    @PostMapping("/{id}/enroll")
    ApiResponse<Void> enroll(@PathVariable Long id) {
        service.enroll(CurrentUsers.require().id(), id);
        return ApiResponse.ok();
    }

    @GetMapping("/{id}/progress")
    ApiResponse<CourseProgress> progress(@PathVariable Long id) {
        return ApiResponse.ok(service.courseProgress(CurrentUsers.require().id(), id));
    }
}
