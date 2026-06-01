package com.mniu.aicamp.coach.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mniu.aicamp.coach.infrastructure.mapper.ChatMessageMapper;
import com.mniu.aicamp.coach.infrastructure.mapper.CoachSessionMapper;
import com.mniu.aicamp.coach.infrastructure.po.ChatMessagePO;
import com.mniu.aicamp.coach.infrastructure.po.CoachSessionPO;
import com.mniu.aicamp.growth.application.GrowthService;
import com.mniu.aicamp.project.domain.ProjectStatus;
import com.mniu.aicamp.project.infrastructure.mapper.ProjectMapper;
import com.mniu.aicamp.project.infrastructure.mapper.ProjectTaskMapper;
import com.mniu.aicamp.project.infrastructure.po.ProjectPO;
import com.mniu.aicamp.project.infrastructure.po.ProjectTaskPO;
import com.mniu.aicamp.roadmap.infrastructure.mapper.RoadmapMapper;
import com.mniu.aicamp.roadmap.infrastructure.mapper.RoadmapTaskMapper;
import com.mniu.aicamp.roadmap.infrastructure.po.RoadmapPO;
import com.mniu.aicamp.roadmap.infrastructure.po.RoadmapTaskPO;
import com.mniu.aicamp.shared.ai.AiClientPort;
import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import com.mniu.aicamp.user.infrastructure.mapper.UserMapper;
import com.mniu.aicamp.user.infrastructure.po.UserPO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.function.Consumer;

@Service
public class CoachService {
    private static final String SYSTEM_PROMPT = "You are an AI programming coach. Use the provided memory and conversation context before answering.";

    private final AiClientPort aiClient;
    private final SnowflakeIdGenerator idGenerator;
    private final UserMapper users;
    private final GrowthService growthService;
    private final CoachSessionMapper sessions;
    private final ChatMessageMapper messages;
    private final RoadmapMapper roadmaps;
    private final RoadmapTaskMapper roadmapTasks;
    private final ProjectMapper projects;
    private final ProjectTaskMapper projectTasks;

    public CoachService(AiClientPort aiClient,
                        SnowflakeIdGenerator idGenerator,
                        UserMapper users,
                        GrowthService growthService,
                        CoachSessionMapper sessions,
                        ChatMessageMapper messages,
                        RoadmapMapper roadmaps,
                        RoadmapTaskMapper roadmapTasks,
                        ProjectMapper projects,
                        ProjectTaskMapper projectTasks) {
        this.aiClient = aiClient;
        this.idGenerator = idGenerator;
        this.users = users;
        this.growthService = growthService;
        this.sessions = sessions;
        this.messages = messages;
        this.roadmaps = roadmaps;
        this.roadmapTasks = roadmapTasks;
        this.projects = projects;
        this.projectTasks = projectTasks;
    }

    public CoachSession createSession(Long userId, String title, String contextType) {
        requireUser(userId);
        Long id = idGenerator.nextId();
        CoachSessionPO session = new CoachSessionPO();
        session.setId(id);
        session.setUserId(userId);
        session.setTitle(blankTo(title, "AI Coach"));
        session.setContextType(contextType);
        sessions.insert(session);
        return loadSession(id);
    }

    @Transactional
    public CoachSession sendMessage(Long userId, Long sessionId, String content) {
        validateMessage(content);
        findSession(userId, sessionId);
        String prompt = buildCoachPrompt(userId, sessionId, content);
        insertMessage(sessionId, "user", content);
        String answer = aiClient.chat(SYSTEM_PROMPT, prompt);
        insertMessage(sessionId, "assistant", answer);
        growthService.addXp(userId, 5, "COACH_MESSAGE_SENT");
        return loadSession(sessionId);
    }

    @Transactional
    public List<String> streamMessage(Long userId, Long sessionId, String content) {
        validateMessage(content);
        findSession(userId, sessionId);
        String prompt = buildCoachPrompt(userId, sessionId, content);
        insertMessage(sessionId, "user", content);
        List<String> chunks = aiClient.stream(SYSTEM_PROMPT, prompt);
        insertMessage(sessionId, "assistant", String.join("", chunks));
        growthService.addXp(userId, 5, "COACH_MESSAGE_SENT");
        return chunks;
    }

    @Transactional
    public void streamMessage(Long userId, Long sessionId, String content, Consumer<String> onToken) {
        validateMessage(content);
        findSession(userId, sessionId);
        String prompt = buildCoachPrompt(userId, sessionId, content);
        StringBuilder answer = new StringBuilder();
        insertMessage(sessionId, "user", content);
        aiClient.stream(SYSTEM_PROMPT, prompt, chunk -> {
            answer.append(chunk);
            onToken.accept(chunk);
        });
        insertMessage(sessionId, "assistant", answer.toString());
        growthService.addXp(userId, 5, "COACH_MESSAGE_SENT");
    }

    public List<CoachSession> listSessions(Long userId) {
        return sessions.selectList(Wrappers.<CoachSessionPO>lambdaQuery()
                        .eq(CoachSessionPO::getUserId, userId)
                        .orderByAsc(CoachSessionPO::getCreatedAt))
                .stream().map(po -> loadSession(po.getId())).toList();
    }

    public CoachSession getSession(Long userId, Long sessionId) {
        return findSession(userId, sessionId);
    }

    public List<ChatMessage> listMessages(Long userId, Long sessionId) {
        return findSession(userId, sessionId).messages();
    }

    public void clearSession(Long userId, Long sessionId) {
        findSession(userId, sessionId);
        messages.delete(Wrappers.<ChatMessagePO>lambdaQuery().eq(ChatMessagePO::getSessionId, sessionId));
    }

    public void deleteSession(Long userId, Long sessionId) {
        findSession(userId, sessionId);
        sessions.deleteById(sessionId);
    }

    public long totalMessages() {
        return messages.selectCount(null);
    }

    private void validateMessage(String content) {
        if (content != null && content.length() > 12000) {
            throw new BusinessException(ErrorCode.MESSAGE_TOO_LONG, "Message is too long");
        }
    }

    private UserPO requireUser(Long userId) {
        UserPO user = users.selectById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND, "User not found");
        }
        return user;
    }

    private CoachSession loadSession(Long id) {
        CoachSessionPO po = sessions.selectById(id);
        if (po == null) {
            throw new BusinessException(ErrorCode.CHAT_SESSION_NOT_FOUND, "Chat session not found");
        }
        List<ChatMessage> sessionMessages = messages.selectList(Wrappers.<ChatMessagePO>lambdaQuery()
                        .eq(ChatMessagePO::getSessionId, id)
                        .orderByAsc(ChatMessagePO::getCreatedAt))
                .stream().map(this::toChatMessage).toList();
        return toCoachSession(po, sessionMessages);
    }

    private CoachSession findSession(Long userId, Long sessionId) {
        CoachSessionPO po = sessions.selectOne(Wrappers.<CoachSessionPO>lambdaQuery()
                .eq(CoachSessionPO::getId, sessionId)
                .eq(CoachSessionPO::getUserId, userId));
        if (po == null) {
            throw new BusinessException(ErrorCode.CHAT_SESSION_NOT_FOUND, "Chat session not found");
        }
        return loadSession(sessionId);
    }

    private void insertMessage(Long sessionId, String role, String content) {
        ChatMessagePO message = new ChatMessagePO();
        message.setId(idGenerator.nextId());
        message.setSessionId(sessionId);
        message.setRole(role);
        message.setContent(content);
        messages.insert(message);
    }

    private String buildCoachPrompt(Long userId, Long sessionId, String currentMessage) {
        UserPO user = requireUser(userId);
        GrowthService.Growth growth = growthService.getGrowth(userId);
        StringBuilder prompt = new StringBuilder();
        prompt.append("Long-term memory\n");
        prompt.append("- Learner: ").append(user.getDisplayName()).append(" <").append(user.getEmail()).append(">\n");
        prompt.append("- Goal: ").append(blankTo(user.getGoal(), "not set")).append("\n");
        prompt.append("- Weekly hours: ").append(user.getWeeklyHours() == null ? 0 : user.getWeeklyHours()).append("\n");
        List<String> skills = split(user.getSkills());
        prompt.append("- Skills: ").append(skills.isEmpty() ? "none" : String.join(", ", skills)).append("\n");
        prompt.append("- Growth: xp=").append(growth.xp()).append(", level=").append(growth.level())
                .append(", streakDays=").append(growth.streakDays()).append("\n");

        appendRoadmapMemory(userId, prompt);
        appendProjectMemory(userId, prompt);
        appendCrossSessionMemory(userId, sessionId, prompt);
        appendShortTermMemory(sessionId, prompt);

        prompt.append("\nCurrent user message\n");
        prompt.append(currentMessage == null ? "" : currentMessage);
        return limitPrompt(prompt.toString(), 24000);
    }

    private void appendRoadmapMemory(Long userId, StringBuilder prompt) {
        List<RoadmapPO> active = roadmaps.selectList(Wrappers.<RoadmapPO>lambdaQuery()
                .eq(RoadmapPO::getUserId, userId)
                .eq(RoadmapPO::getActive, true)
                .orderByDesc(RoadmapPO::getCreatedAt)
                .last("limit 1"));
        if (active.isEmpty()) {
            prompt.append("- Active roadmap: none\n");
            return;
        }
        RoadmapPO roadmap = active.getFirst();
        List<RoadmapTaskPO> tasks = roadmapTasks.selectList(Wrappers.<RoadmapTaskPO>lambdaQuery()
                .eq(RoadmapTaskPO::getRoadmapId, roadmap.getId())
                .orderByAsc(RoadmapTaskPO::getWeek));
        long completed = tasks.stream().filter(task -> Boolean.TRUE.equals(task.getCompleted())).count();
        prompt.append("- Active roadmap: ").append(roadmap.getTargetRole())
                .append(" (").append(completed).append("/").append(tasks.size()).append(" tasks completed)\n");
        tasks.stream().limit(6).forEach(task -> prompt.append("  * week ")
                .append(valueOrZero(task.getWeek())).append(": ").append(Boolean.TRUE.equals(task.getCompleted()) ? "[done] " : "[todo] ")
                .append(task.getTitle()).append("\n"));
    }

    private void appendProjectMemory(Long userId, StringBuilder prompt) {
        List<ProjectPO> activeProjects = projects.selectList(Wrappers.<ProjectPO>lambdaQuery()
                .eq(ProjectPO::getUserId, userId)
                .ne(ProjectPO::getStatus, ProjectStatus.COMPLETED.name())
                .orderByDesc(ProjectPO::getCreatedAt)
                .last("limit 3"));
        if (activeProjects.isEmpty()) {
            prompt.append("- Active projects: none\n");
            return;
        }
        prompt.append("- Active projects\n");
        activeProjects.forEach(project -> {
            List<ProjectTaskPO> tasks = projectTasks.selectList(Wrappers.<ProjectTaskPO>lambdaQuery()
                    .eq(ProjectTaskPO::getProjectId, project.getId()));
            long completed = tasks.stream().filter(task -> Boolean.TRUE.equals(task.getCompleted())).count();
            prompt.append("  * ").append(project.getName()).append(" [").append(project.getType()).append(", ")
                    .append(project.getStatus()).append(", ").append(completed).append("/")
                    .append(tasks.size()).append(" tasks completed]\n");
            tasks.stream().filter(task -> !Boolean.TRUE.equals(task.getCompleted())).limit(3)
                    .forEach(task -> prompt.append("    - next: ").append(task.getTitle()).append("\n"));
        });
    }

    private void appendCrossSessionMemory(Long userId, Long sessionId, StringBuilder prompt) {
        List<CoachSessionPO> userSessions = sessions.selectList(Wrappers.<CoachSessionPO>lambdaQuery()
                .eq(CoachSessionPO::getUserId, userId)
                .ne(CoachSessionPO::getId, sessionId)
                .orderByDesc(CoachSessionPO::getCreatedAt)
                .last("limit 5"));
        List<Long> sessionIds = userSessions.stream().map(CoachSessionPO::getId).toList();
        if (sessionIds.isEmpty()) {
            prompt.append("- Recent cross-session memory: none\n");
            return;
        }
        List<ChatMessagePO> recentMessages = messages.selectList(Wrappers.<ChatMessagePO>lambdaQuery()
                .in(ChatMessagePO::getSessionId, sessionIds)
                .eq(ChatMessagePO::getRole, "user")
                .orderByDesc(ChatMessagePO::getCreatedAt)
                .last("limit 6"));
        if (recentMessages.isEmpty()) {
            prompt.append("- Recent cross-session memory: none\n");
            return;
        }
        prompt.append("- Recent cross-session memory\n");
        recentMessages.forEach(message -> prompt.append("  * user: ")
                .append(trimForPrompt(message.getContent(), 300)).append("\n"));
    }

    private void appendShortTermMemory(Long sessionId, StringBuilder prompt) {
        List<ChatMessagePO> recent = messages.selectList(Wrappers.<ChatMessagePO>lambdaQuery()
                .eq(ChatMessagePO::getSessionId, sessionId)
                .orderByDesc(ChatMessagePO::getCreatedAt)
                .last("limit 12"));
        if (recent.isEmpty()) {
            prompt.append("\nShort-term conversation memory: none\n");
            return;
        }
        List<ChatMessagePO> chronological = new ArrayList<>(recent);
        Collections.reverse(chronological);
        prompt.append("\nShort-term conversation memory\n");
        chronological.forEach(message -> prompt.append("- ").append(message.getRole()).append(": ")
                .append(trimForPrompt(message.getContent(), 500)).append("\n"));
    }

    private String limitPrompt(String prompt, int maxChars) {
        if (prompt.length() <= maxChars) {
            return prompt;
        }
        return prompt.substring(0, maxChars) + "\n[context truncated]";
    }

    private String trimForPrompt(String value, int maxChars) {
        if (value == null) {
            return "";
        }
        String normalized = value.replaceAll("\\s+", " ").trim();
        return normalized.length() <= maxChars ? normalized : normalized.substring(0, maxChars) + "...";
    }

    private CoachSession toCoachSession(CoachSessionPO po, List<ChatMessage> sessionMessages) {
        Instant updatedAt = sessionMessages.isEmpty()
                ? po.getCreatedAt()
                : sessionMessages.get(sessionMessages.size() - 1).createdAt();
        return new CoachSession(po.getId(), po.getUserId(), po.getTitle(), po.getContextType(), po.getCreatedAt(), updatedAt,
                new ArrayList<>(sessionMessages));
    }

    private ChatMessage toChatMessage(ChatMessagePO po) {
        return new ChatMessage(po.getId(), po.getRole(), po.getContent(), po.getCreatedAt());
    }

    private String blankTo(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private List<String> split(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }
        return List.of(value.split("\\R"));
    }

    private int valueOrZero(Integer value) {
        return value == null ? 0 : value;
    }
}
