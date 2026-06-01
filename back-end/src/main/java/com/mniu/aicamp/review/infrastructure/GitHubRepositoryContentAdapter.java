package com.mniu.aicamp.review.infrastructure;

import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import org.kohsuke.github.GHContent;
import org.kohsuke.github.GHRateLimit;
import org.kohsuke.github.GHRepository;
import org.kohsuke.github.GitHub;
import org.kohsuke.github.GitHubBuilder;
import org.kohsuke.github.HttpException;
import org.kohsuke.github.extras.HttpClientGitHubConnector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.http.HttpClient;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@ConditionalOnProperty(name = "app.repository.provider", havingValue = "github", matchIfMissing = true)
class GitHubRepositoryContentAdapter implements RepositoryContentPort {
    private static final int MAX_FILES = 200;
    private static final int MAX_SINGLE_FILE_BYTES = 80 * 1024;
    private static final int MAX_TOTAL_BYTES = 300 * 1024;
    private static final Set<String> SKIPPED_DIRS = Set.of(".git", ".idea", "node_modules", "target", "build", "dist", ".next");
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            ".java", ".kt", ".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".rs", ".md", ".yml", ".yaml", ".json", ".xml", ".sql"
    );

    private final GitHub gitHub;

    @Autowired
    GitHubRepositoryContentAdapter(@Value("${app.github.token:${GITHUB_TOKEN:}}") String token,
                                   @Value("${app.github.connect-timeout:5s}") Duration connectTimeout) throws IOException {
        this(buildGitHub(token, connectTimeout));
    }

    GitHubRepositoryContentAdapter(GitHub gitHub) {
        this.gitHub = gitHub;
    }

    private static GitHub buildGitHub(String token, Duration connectTimeout) throws IOException {
        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(connectTimeout)
                .build();
        GitHubBuilder builder = new GitHubBuilder()
                .withConnector(new HttpClientGitHubConnector(httpClient));
        return token == null || token.isBlank()
                ? builder.build()
                : builder.withOAuthToken(token).build();
    }

    @Override
    public RepositorySnapshot fetch(String repositoryUrl, String branch) {
        RepositoryRef ref = parseRepository(repositoryUrl);
        try {
            GHRateLimit.Record coreLimit = gitHub.getRateLimit().getCore();
            if (coreLimit.getRemaining() <= 0) {
                throw new BusinessException(ErrorCode.REPO_RATE_LIMITED, "GitHub API 已限流，请配置 GITHUB_TOKEN 或稍后再试");
            }
            GHRepository repository = gitHub.getRepository(ref.owner() + "/" + ref.name());
            String resolvedBranch = branch == null || branch.isBlank() ? repository.getDefaultBranch() : branch;
            List<RepositoryFile> files = new ArrayList<>();
            collect(repository, "", resolvedBranch, files, new int[]{0});
            if (files.isEmpty()) {
                throw new BusinessException(ErrorCode.REPO_NOT_ACCESSIBLE, "仓库中没有可审查的代码文件");
            }
            return new RepositorySnapshot(ref.owner() + "/" + ref.name(), resolvedBranch, files);
        } catch (BusinessException ex) {
            throw ex;
        } catch (HttpException ex) {
            if (ex.getResponseCode() == 403 || ex.getResponseCode() == 429) {
                throw new BusinessException(ErrorCode.REPO_RATE_LIMITED,
                        "GitHub API 已限流，请配置 GITHUB_TOKEN 或稍后再试");
            }
            throw new BusinessException(ErrorCode.REPO_NOT_ACCESSIBLE, "仓库不可访问，请确认地址、权限和分支");
        } catch (Exception ex) {
            throw new BusinessException(ErrorCode.REPO_NOT_ACCESSIBLE, "仓库不可访问，请确认地址、权限和分支");
        }
    }

    private void collect(GHRepository repository, String path, String branch, List<RepositoryFile> files, int[] totalBytes) throws IOException {
        if (files.size() >= MAX_FILES) {
            throw new BusinessException(ErrorCode.REPO_TOO_LARGE, "仓库可审查文件过多");
        }
        for (GHContent content : repository.getDirectoryContent(path, branch)) {
            if (files.size() >= MAX_FILES) {
                throw new BusinessException(ErrorCode.REPO_TOO_LARGE, "仓库可审查文件过多");
            }
            String contentPath = content.getPath();
            if (content.isDirectory()) {
                String name = contentPath.substring(contentPath.lastIndexOf('/') + 1);
                if (!SKIPPED_DIRS.contains(name)) {
                    collect(repository, contentPath, branch, files, totalBytes);
                }
                continue;
            }
            if (!isReviewable(contentPath) || content.getSize() > MAX_SINGLE_FILE_BYTES) {
                continue;
            }
            byte[] bytes = content.read().readAllBytes();
            if (bytes.length > MAX_SINGLE_FILE_BYTES) {
                continue;
            }
            if (totalBytes[0] + bytes.length > MAX_TOTAL_BYTES) {
                throw new BusinessException(ErrorCode.REPO_TOO_LARGE, "仓库内容超过审查限制");
            }
            totalBytes[0] += bytes.length;
            files.add(new RepositoryFile(contentPath, new String(bytes, StandardCharsets.UTF_8)));
        }
    }

    private boolean isReviewable(String path) {
        return ALLOWED_EXTENSIONS.stream().anyMatch(path::endsWith);
    }

    private RepositoryRef parseRepository(String repositoryUrl) {
        if (repositoryUrl == null || repositoryUrl.isBlank()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "请填写 GitHub 仓库 URL");
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
            throw new BusinessException(ErrorCode.BAD_REQUEST, "GitHub 仓库 URL 必须包含 owner 和 repository");
        }
        return new RepositoryRef(parts[0], parts[1]);
    }

    private record RepositoryRef(String owner, String name) {
    }
}
