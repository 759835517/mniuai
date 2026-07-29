package com.mniu.aicamp.rag.api;

import com.mniu.aicamp.rag.application.DocumentChunkService;
import com.mniu.aicamp.shared.api.ApiResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/rag")
public class RagController {

    private final DocumentChunkService documentChunkService;

    public RagController(DocumentChunkService documentChunkService) {
        this.documentChunkService = documentChunkService;
    }

    /**
     * 索引所有已发布课程的课时内容。
     */
    @PostMapping("/index-all")
    ApiResponse<Map<String, Integer>> indexAll() {
        int total = documentChunkService.indexAllPublishedLessons();
        return ApiResponse.ok(Map.of("totalChunks", total));
    }

    /**
     * 索引指定课时的内容。
     */
    @PostMapping("/index-lesson/{lessonId}")
    ApiResponse<Map<String, Integer>> indexLesson(@PathVariable Long lessonId) {
        int count = documentChunkService.indexLesson(lessonId);
        return ApiResponse.ok(Map.of("chunksCreated", count));
    }
}
