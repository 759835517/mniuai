package com.mniu.aicamp.course.api;

import com.mniu.aicamp.course.application.Course;
import com.mniu.aicamp.course.application.CourseCreateRequest;
import com.mniu.aicamp.course.application.CourseService;
import com.mniu.aicamp.course.application.CourseUpdateRequest;
import com.mniu.aicamp.course.application.Lesson;
import com.mniu.aicamp.course.application.LessonCreateRequest;
import com.mniu.aicamp.course.application.LessonUpdateRequest;
import com.mniu.aicamp.shared.api.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/courses")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCourseController {
    private final CourseService service;

    public AdminCourseController(CourseService service) {
        this.service = service;
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
