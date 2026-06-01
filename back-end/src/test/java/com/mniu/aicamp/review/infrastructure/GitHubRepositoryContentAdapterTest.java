package com.mniu.aicamp.review.infrastructure;

import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import org.junit.jupiter.api.Test;
import org.kohsuke.github.GHContent;
import org.kohsuke.github.GHRateLimit;
import org.kohsuke.github.GHRepository;
import org.kohsuke.github.GitHub;
import org.kohsuke.github.HttpException;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class GitHubRepositoryContentAdapterTest {

    @Test
    void fetchCollectsReviewableFilesAndSkipsIgnoredContent() throws Exception {
        GitHub gitHub = mockGitHubWithRemainingLimit(10);
        GHRepository repository = mock(GHRepository.class);
        when(gitHub.getRepository("mniu/example")).thenReturn(repository);
        when(repository.getDefaultBranch()).thenReturn("main");
        List<GHContent> rootContents = List.of(
                directory("src"),
                directory("node_modules"),
                file("README.md", "readme"),
                file("image.png", "binary")
        );
        List<GHContent> srcContents = List.of(
                file("src/App.java", "class App {}"),
                largeFile("src/Large.java", 90 * 1024)
        );
        when(repository.getDirectoryContent("", "main")).thenReturn(rootContents);
        when(repository.getDirectoryContent("src", "main")).thenReturn(srcContents);

        RepositoryContentPort.RepositorySnapshot snapshot = new GitHubRepositoryContentAdapter(gitHub)
                .fetch("git@github.com:mniu/example.git", "");

        assertThat(snapshot.repository()).isEqualTo("mniu/example");
        assertThat(snapshot.branch()).isEqualTo("main");
        assertThat(snapshot.files()).extracting(RepositoryContentPort.RepositoryFile::path)
                .containsExactly("src/App.java", "README.md");
        assertThat(snapshot.combinedText()).contains("class App {}", "readme");
        verify(repository).getDirectoryContent("", "main");
        verify(repository).getDirectoryContent("src", "main");
    }

    @Test
    void fetchUsesRequestedBranch() throws Exception {
        GitHub gitHub = mockGitHubWithRemainingLimit(1);
        GHRepository repository = mock(GHRepository.class);
        when(gitHub.getRepository("mniu/example")).thenReturn(repository);
        List<GHContent> rootContents = List.of(file("service.ts", "export {};"));
        when(repository.getDirectoryContent("", "develop")).thenReturn(rootContents);

        RepositoryContentPort.RepositorySnapshot snapshot = new GitHubRepositoryContentAdapter(gitHub)
                .fetch("https://github.com/mniu/example", "develop");

        assertThat(snapshot.branch()).isEqualTo("develop");
        assertThat(snapshot.files()).hasSize(1);
    }

    @Test
    void fetchRejectsRateLimitedGitHubClient() throws Exception {
        GitHub gitHub = mockGitHubWithRemainingLimit(0);

        assertThatThrownBy(() -> new GitHubRepositoryContentAdapter(gitHub)
                .fetch("https://github.com/mniu/example", "main"))
                .isInstanceOfSatisfying(BusinessException.class,
                        ex -> assertThat(ex.code()).isEqualTo(ErrorCode.REPO_RATE_LIMITED));
    }

    @Test
    void fetchRejectsInvalidRepositoryUrlBeforeCallingGitHub() throws Exception {
        GitHub gitHub = mockGitHubWithRemainingLimit(10);

        assertThatThrownBy(() -> new GitHubRepositoryContentAdapter(gitHub).fetch("https://github.com/mniu", "main"))
                .isInstanceOfSatisfying(BusinessException.class,
                        ex -> assertThat(ex.code()).isEqualTo(ErrorCode.BAD_REQUEST));
    }

    @Test
    void fetchMapsGitHubFailuresToRepositoryNotAccessible() throws Exception {
        GitHub gitHub = mockGitHubWithRemainingLimit(10);
        when(gitHub.getRepository("mniu/private")).thenThrow(new IOException("not found"));

        assertThatThrownBy(() -> new GitHubRepositoryContentAdapter(gitHub)
                .fetch("https://github.com/mniu/private", "main"))
                .isInstanceOfSatisfying(BusinessException.class,
                        ex -> assertThat(ex.code()).isEqualTo(ErrorCode.REPO_NOT_ACCESSIBLE));
    }

    @Test
    void fetchMapsGitHubHttpRateLimitFailuresToRateLimited() throws Exception {
        GitHub gitHub = mockGitHubWithRemainingLimit(10);
        when(gitHub.getRepository("mniu/limited"))
                .thenThrow(new HttpException("API rate limit exceeded", 403, "Forbidden", "https://api.github.com/repos/mniu/limited"));

        assertThatThrownBy(() -> new GitHubRepositoryContentAdapter(gitHub)
                .fetch("https://github.com/mniu/limited", "main"))
                .isInstanceOfSatisfying(BusinessException.class, ex -> {
                    assertThat(ex.code()).isEqualTo(ErrorCode.REPO_RATE_LIMITED);
                    assertThat(ex.getMessage()).contains("GitHub API 已限流");
                });
    }

    @Test
    void fetchRejectsRepositoriesWithTooManyReviewableFiles() throws Exception {
        GitHub gitHub = mockGitHubWithRemainingLimit(10);
        GHRepository repository = mock(GHRepository.class);
        when(gitHub.getRepository("mniu/huge")).thenReturn(repository);
        List<GHContent> files = new ArrayList<>();
        for (int index = 0; index < 201; index++) {
            files.add(file("src/File" + index + ".java", "class File" + index + " {}"));
        }
        when(repository.getDirectoryContent("", "main")).thenReturn(files);

        assertThatThrownBy(() -> new GitHubRepositoryContentAdapter(gitHub)
                .fetch("github.com/mniu/huge", "main"))
                .isInstanceOfSatisfying(BusinessException.class,
                        ex -> assertThat(ex.code()).isEqualTo(ErrorCode.REPO_TOO_LARGE));
    }

    @Test
    void fetchRejectsRepositoryWithoutReviewableFiles() throws Exception {
        GitHub gitHub = mockGitHubWithRemainingLimit(10);
        GHRepository repository = mock(GHRepository.class);
        when(gitHub.getRepository("mniu/assets")).thenReturn(repository);
        List<GHContent> rootContents = List.of(file("logo.png", "binary"));
        when(repository.getDirectoryContent("", "main")).thenReturn(rootContents);

        assertThatThrownBy(() -> new GitHubRepositoryContentAdapter(gitHub)
                .fetch("github.com/mniu/assets", "main"))
                .isInstanceOfSatisfying(BusinessException.class,
                        ex -> assertThat(ex.code()).isEqualTo(ErrorCode.REPO_NOT_ACCESSIBLE));
    }

    private GitHub mockGitHubWithRemainingLimit(int remaining) throws IOException {
        GitHub gitHub = mock(GitHub.class);
        GHRateLimit rateLimit = mock(GHRateLimit.class);
        GHRateLimit.Record core = mock(GHRateLimit.Record.class);
        when(gitHub.getRateLimit()).thenReturn(rateLimit);
        when(rateLimit.getCore()).thenReturn(core);
        when(core.getRemaining()).thenReturn(remaining);
        return gitHub;
    }

    private GHContent directory(String path) {
        GHContent content = mock(GHContent.class);
        when(content.isDirectory()).thenReturn(true);
        when(content.getPath()).thenReturn(path);
        return content;
    }

    private GHContent file(String path, String text) throws IOException {
        byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
        GHContent content = mock(GHContent.class);
        when(content.isDirectory()).thenReturn(false);
        when(content.getPath()).thenReturn(path);
        when(content.getSize()).thenReturn((long) bytes.length);
        when(content.read()).thenReturn(new ByteArrayInputStream(bytes));
        return content;
    }

    private GHContent largeFile(String path, long size) {
        GHContent content = mock(GHContent.class);
        when(content.isDirectory()).thenReturn(false);
        when(content.getPath()).thenReturn(path);
        when(content.getSize()).thenReturn(size);
        return content;
    }
}
