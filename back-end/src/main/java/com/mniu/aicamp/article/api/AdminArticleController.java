package com.mniu.aicamp.article.api;

import com.mniu.aicamp.article.application.Article;
import com.mniu.aicamp.article.application.ArticleCreateRequest;
import com.mniu.aicamp.article.application.ArticleDetail;
import com.mniu.aicamp.article.application.ArticleService;
import com.mniu.aicamp.article.application.ArticleUpdateRequest;
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
@RequestMapping("/api/v1/admin/articles")
@PreAuthorize("hasRole('ADMIN')")
public class AdminArticleController {
    private final ArticleService service;

    public AdminArticleController(ArticleService service) {
        this.service = service;
    }

    @GetMapping
    ApiResponse<PageResponse<Article>> list(@RequestParam(required = false) String status,
                                            @RequestParam(required = false) String category,
                                            @RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(service.listAll(status, category, page, size));
    }

    @GetMapping("/{id}")
    ApiResponse<ArticleDetail> get(@PathVariable Long id) {
        return ApiResponse.ok(service.getDetailById(id));
    }

    @PostMapping
    ApiResponse<Article> create(@Valid @RequestBody ArticleCreateRequest request) {
        return ApiResponse.ok(service.createDraft(request));
    }

    @PutMapping("/{id}")
    ApiResponse<Article> update(@PathVariable Long id, @Valid @RequestBody ArticleUpdateRequest request) {
        return ApiResponse.ok(service.updateArticle(id, request));
    }

    @PostMapping("/{id}/publish")
    ApiResponse<Article> publish(@PathVariable Long id) {
        return ApiResponse.ok(service.publishArticle(id));
    }

    @PostMapping("/{id}/archive")
    ApiResponse<Article> archive(@PathVariable Long id) {
        return ApiResponse.ok(service.archiveArticle(id));
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> delete(@PathVariable Long id) {
        service.deleteArticle(id);
        return ApiResponse.ok();
    }
}
