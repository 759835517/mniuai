package com.mniu.aicamp.review.api;

import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.api.PageResponse;
import com.mniu.aicamp.shared.security.CurrentUsers;
import com.mniu.aicamp.user.application.PlatformService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
public class CodeReviewController {
    private final PlatformService service;

    public CodeReviewController(PlatformService service) {
        this.service = service;
    }

    @PostMapping("/snippet")
    ApiResponse<PlatformService.CodeReview> snippet(@Valid @RequestBody SnippetReviewRequest request) {
        return ApiResponse.ok(service.reviewSnippet(CurrentUsers.require().id(), request.language(), request.code()));
    }

    @PostMapping
    ApiResponse<PlatformService.CodeReview> submit(@Valid @RequestBody SubmitReviewRequest request) {
        return ApiResponse.ok(service.reviewSnippet(CurrentUsers.require().id(), request.language(), request.code()));
    }

    @GetMapping
    ApiResponse<?> list(@RequestParam(required = false) Integer page, @RequestParam(required = false) Integer size) {
        List<PlatformService.CodeReview> reviews = service.listReviews(CurrentUsers.require().id());
        if (page == null && size == null) {
            return ApiResponse.ok(reviews);
        }
        return ApiResponse.ok(PageResponse.of(reviews, page == null ? 0 : page, size == null ? 20 : size));
    }

    @GetMapping("/{reviewId}")
    ApiResponse<PlatformService.CodeReview> detail(@PathVariable Long reviewId) {
        return ApiResponse.ok(service.getReview(CurrentUsers.require().id(), reviewId));
    }
}

record SnippetReviewRequest(@NotBlank String language, @NotBlank String code) {
}

record SubmitReviewRequest(String sourceType, String sourceRef, String branch, @NotBlank String language, @NotBlank String code) {
}

