package com.mniu.aicamp.review.infrastructure;

import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConditionalOnProperty(name = "app.repository.provider", havingValue = "fake", matchIfMissing = true)
class FakeRepositoryContentAdapter implements RepositoryContentPort {
    @Override
    public RepositorySnapshot fetch(String repositoryUrl, String branch) {
        String repository = normalize(repositoryUrl);
        if (repositoryUrl.contains("too-large")) {
            throw new BusinessException(ErrorCode.REPO_TOO_LARGE, "Repository content exceeds review limit");
        }
        if (repositoryUrl.contains("not-accessible")) {
            throw new BusinessException(ErrorCode.REPO_NOT_ACCESSIBLE, "Repository is not accessible");
        }
        return new RepositorySnapshot(repository, branch == null || branch.isBlank() ? "main" : branch, List.of(
                new RepositoryFile("src/main/java/App.java", "class App { void run() {} }"),
                new RepositoryFile("src/test/java/AppTest.java", "class AppTest { }")
        ));
    }

    private String normalize(String repositoryUrl) {
        if (repositoryUrl == null || repositoryUrl.isBlank()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Repository URL is required");
        }
        String value = repositoryUrl.trim();
        int marker = value.indexOf("github.com/");
        if (marker >= 0) {
            value = value.substring(marker + "github.com/".length());
        }
        value = value.replaceFirst("^git@github.com:", "")
                .replaceFirst("^https?://github.com/", "")
                .replaceFirst("\\.git$", "");
        String[] parts = value.split("/");
        if (parts.length < 2 || parts[0].isBlank() || parts[1].isBlank()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Repository URL must include owner and repository");
        }
        return parts[0] + "/" + parts[1];
    }
}
