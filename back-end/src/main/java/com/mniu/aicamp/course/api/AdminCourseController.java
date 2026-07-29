package com.mniu.aicamp.course.api;

import java.util.List;

import com.mniu.aicamp.course.application.Course;
import com.mniu.aicamp.course.application.CourseCreateRequest;
import com.mniu.aicamp.course.application.CourseService;
import com.mniu.aicamp.course.application.CourseUpdateRequest;
import com.mniu.aicamp.course.application.Lesson;
import com.mniu.aicamp.course.application.LessonCreateRequest;
import com.mniu.aicamp.course.application.LessonUpdateRequest;
import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.api.PageResponse;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/courses")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCourseController {
    private final CourseService service;

    public AdminCourseController(CourseService service) {
        this.service = service;
    }

    @GetMapping
    ApiResponse<PageResponse<Course>> list(@RequestParam(required = false) String status,
                                           @RequestParam(required = false) String category,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(service.listAll(status, category, page, size));
    }

    @GetMapping("/{id}")
    ApiResponse<Course> get(@PathVariable Long id) {
        return ApiResponse.ok(service.getCourseById(id));
    }

    @PostMapping
    ApiResponse<Course> create(@Valid @RequestBody CourseCreateRequest request) {
        return ApiResponse.ok(service.createCourse(request));
    }

    @PutMapping("/{id}")
    ApiResponse<Course> update(@PathVariable Long id, @Valid @RequestBody CourseUpdateRequest request) {
        return ApiResponse.ok(service.updateCourse(id, request));
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> delete(@PathVariable Long id) {
        service.deleteCourse(id);
        return ApiResponse.ok();
    }

    @GetMapping("/{courseId}/lessons")
    ApiResponse<List<Lesson>> listLessons(@PathVariable Long courseId) {
        return ApiResponse.ok(service.listLessons(courseId));
    }

    @PostMapping("/{courseId}/lessons")
    ApiResponse<Lesson> createLesson(@PathVariable Long courseId, @Valid @RequestBody LessonCreateRequest request) {
        return ApiResponse.ok(service.createLesson(courseId, request));
    }

    @PutMapping("/lessons/{lessonId}")
    ApiResponse<Lesson> updateLesson(@PathVariable Long lessonId, @Valid @RequestBody LessonUpdateRequest request) {
        return ApiResponse.ok(service.updateLesson(lessonId, request));
    }

    @DeleteMapping("/lessons/{lessonId}")
    ApiResponse<Void> deleteLesson(@PathVariable Long lessonId) {
        service.deleteLesson(lessonId);
        return ApiResponse.ok();
    }
}
