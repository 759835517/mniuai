package com.mniu.aicamp.article.api;

import com.mniu.aicamp.article.application.ArticleDetail;
import com.mniu.aicamp.article.application.ArticleService;
import com.mniu.aicamp.article.application.ReadProgressRequest;
import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.api.PageResponse;
import com.mniu.aicamp.shared.security.CurrentUsers;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/articles")
public class ArticleController {
    private final ArticleService service;

    public ArticleController(ArticleService service) {
        this.service = service;
    }

    @GetMapping
    ApiResponse<PageResponse<com.mniu.aicamp.article.application.Article>> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(service.listPublished(category, tag, page, size));
    }

    @GetMapping("/{slug}")
    ApiResponse<ArticleDetail> detail(@PathVariable String slug) {
        return ApiResponse.ok(service.getBySlug(slug));
    }

    @PostMapping("/{id}/read-progress")
    ApiResponse<Void> reportProgress(@PathVariable Long id, @RequestBody ReadProgressRequest request) {
        service.reportReadProgress(CurrentUsers.require().id(), id, request);
        return ApiResponse.ok();
    }

    @PostMapping("/{id}/like")
    ApiResponse<Void> like(@PathVariable Long id) {
        service.likeArticle(CurrentUsers.require().id(), id);
        return ApiResponse.ok();
    }
}
