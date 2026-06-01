package com.mniu.aicamp.review.infrastructure;

import java.util.List;

public interface RepositoryContentPort {
    RepositorySnapshot fetch(String repositoryUrl, String branch);

    record RepositorySnapshot(String repository, String branch, List<RepositoryFile> files) {
        public String combinedText() {
            StringBuilder builder = new StringBuilder();
            for (RepositoryFile file : files) {
                builder.append("\n--- file: ").append(file.path()).append(" ---\n");
                builder.append(file.content()).append('\n');
            }
            return builder.toString();
        }
    }

    record RepositoryFile(String path, String content) {
    }
}
