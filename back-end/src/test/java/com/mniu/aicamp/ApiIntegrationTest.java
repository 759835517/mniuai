package com.mniu.aicamp;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class ApiIntegrationTest extends IntegrationTestBase {
    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper objectMapper;

    @Test
    void protectedApiRequiresToken() throws Exception {
        mvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error.code").value("UNAUTHORIZED"));
    }

    @Test
    void endToEndApiFlowWorks() throws Exception {
        String email = "it-" + UUID.randomUUID() + "@example.com";
        JsonNode registered = postJson("/api/v1/auth/register", """
                {"email":"%s","password":"password1","displayName":"Integration"}
                """.formatted(email));
        String accessToken = registered.at("/data/accessToken").asText();
        String refreshToken = registered.at("/data/refreshToken").asText();

        mvc.perform(get("/api/v1/users/me").header(HttpHeaders.AUTHORIZATION, bearer(accessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value(email))
                .andExpect(jsonPath("$.data.passwordHash").doesNotExist());

        JsonNode login = postJson("/api/v1/auth/login", """
                {"email":"%s","password":"password1"}
                """.formatted(email));
        assertThat(login.at("/data/accessToken").asText()).startsWith("acc_");

        JsonNode refresh = postJson("/api/v1/auth/refresh", """
                {"refreshToken":"%s"}
                """.formatted(refreshToken));
        assertThat(refresh.at("/data/refreshToken").asText()).isNotEqualTo(refreshToken);

        mvc.perform(put("/api/v1/users/me/profile")
                        .header(HttpHeaders.AUTHORIZATION, bearer(accessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"goal\":\"Build AI apps\",\"weeklyHours\":12}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.goal").value("Build AI apps"));

        JsonNode roadmap = postJsonWithToken("/api/v1/roadmaps", accessToken, """
                {"targetRole":"AI Engineer","weeklyHours":10,"durationWeeks":2}
                """);
        String firstRoadmapId = roadmap.at("/data/id").asText();
        String taskId = roadmap.at("/data/tasks/0/id").asText();
        assertThat(roadmap.at("/data/tasks/0/title").asText()).isEqualTo("Build Java AI service skeleton");
        JsonNode secondRoadmap = postJsonWithToken("/api/v1/roadmaps", accessToken, """
                {"targetRole":"Agent Engineer","weeklyHours":8,"durationWeeks":1}
                """);
        String activeRoadmapId = secondRoadmap.at("/data/id").asText();
        mvc.perform(get("/api/v1/roadmaps").header(HttpHeaders.AUTHORIZATION, bearer(accessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(2));
        mvc.perform(get("/api/v1/roadmaps/{roadmapId}", firstRoadmapId).header(HttpHeaders.AUTHORIZATION, bearer(accessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(firstRoadmapId));
        mvc.perform(put("/api/v1/roadmaps/{roadmapId}/active", firstRoadmapId).header(HttpHeaders.AUTHORIZATION, bearer(accessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.active").value(true));
        mvc.perform(put("/api/v1/roadmaps/{roadmapId}/active", activeRoadmapId).header(HttpHeaders.AUTHORIZATION, bearer(accessToken)))
                .andExpect(status().isOk());
        mvc.perform(put("/api/v1/roadmaps/tasks/{taskId}", taskId)
                        .header(HttpHeaders.AUTHORIZATION, bearer(accessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"completed\":true}"))
                .andExpect(status().isNotFound());
        JsonNode active = getJsonWithToken("/api/v1/roadmaps/active", accessToken);
        String activeTaskId = active.at("/data/tasks/0/id").asText();
        for (JsonNode activeTask : active.at("/data/tasks")) {
            mvc.perform(put("/api/v1/roadmaps/tasks/{taskId}", activeTask.get("id").asText())
                            .header(HttpHeaders.AUTHORIZATION, bearer(accessToken))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"completed\":true}"))
                    .andExpect(status().isOk());
        }
        mvc.perform(get("/api/v1/roadmaps/{roadmapId}/progress", active.at("/data/id").asText())
                        .header(HttpHeaders.AUTHORIZATION, bearer(accessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.completionPercent").value(100));

        mvc.perform(put("/api/v1/roadmaps/{roadmapId}/tasks/{taskId}", active.at("/data/id").asText(), activeTaskId)
                        .header(HttpHeaders.AUTHORIZATION, bearer(accessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"completed\":false}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.tasks[0].completed").value(false));

        JsonNode session = postJsonWithToken("/api/v1/coach/sessions", accessToken, """
                {"title":"General","contextType":"GENERAL"}
                """);
        String sessionId = session.at("/data/id").asText();
        mvc.perform(post("/api/v1/coach/sessions/{sessionId}/messages", sessionId)
                        .header(HttpHeaders.AUTHORIZATION, bearer(accessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\":\"Help me learn testing\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.messages.length()").value(2));
        mvc.perform(get("/api/v1/coach/sessions/{sessionId}", sessionId)
                        .header(HttpHeaders.AUTHORIZATION, bearer(accessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.messages.length()").value(2));
        var streamResult = mvc.perform(post("/api/v1/coach/sessions/{sessionId}/messages/stream", sessionId)
                        .header(HttpHeaders.AUTHORIZATION, bearer(accessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\":\"Stream a testing hint\"}"))
                .andExpect(request().asyncStarted())
                .andReturn();

        var dispatchedStreamResult = mvc.perform(asyncDispatch(streamResult))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CACHE_CONTROL, "no-cache, no-transform"))
                .andExpect(header().string("X-Accel-Buffering", "no"))
                .andReturn();
        assertThat(dispatchedStreamResult.getResponse().getContentType()).contains(MediaType.TEXT_EVENT_STREAM_VALUE);
        assertThat(dispatchedStreamResult.getResponse().getContentAsString())
                .contains("event:token", "\"delta\":", "event:done");
        assertThat(dispatchedStreamResult.getResponse().getContentAsString().split("event:token", -1).length - 1)
                .isGreaterThanOrEqualTo(2);

        JsonNode project = postJsonWithToken("/api/v1/projects", accessToken, """
                {"name":"RAG Demo","type":"RAG"}
                """);
        String projectId = project.at("/data/id").asText();
        assertThat(project.at("/data/tasks/0/title").asText()).isEqualTo("Design API contract");
        mvc.perform(get("/api/v1/projects/{projectId}", projectId)
                        .header(HttpHeaders.AUTHORIZATION, bearer(accessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("RAG Demo"));
        mvc.perform(post("/api/v1/projects/{projectId}/discuss", projectId)
                        .header(HttpHeaders.AUTHORIZATION, bearer(accessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.contextType").value("PROJECT"));
        for (JsonNode task : project.at("/data/tasks")) {
            mvc.perform(put("/api/v1/projects/{projectId}/tasks/{taskId}", projectId, task.get("id").asText())
                            .header(HttpHeaders.AUTHORIZATION, bearer(accessToken))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"completed\":true}"))
                    .andExpect(status().isOk());
        }
        mvc.perform(put("/api/v1/projects/{projectId}/status", projectId)
                        .header(HttpHeaders.AUTHORIZATION, bearer(accessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"COMPLETED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("COMPLETED"));

        mvc.perform(post("/api/v1/reviews/snippet")
                        .header(HttpHeaders.AUTHORIZATION, bearer(accessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"language\":\"java\",\"code\":\"class A {}\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.score").value(86));
        mvc.perform(post("/api/v1/reviews/repository")
                        .header(HttpHeaders.AUTHORIZATION, bearer(accessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"repositoryUrl\":\"https://github.com/mniu/example\",\"branch\":\"main\",\"language\":\"java\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.language").value("java"))
                .andExpect(jsonPath("$.data.suggestions[0]").value(org.hamcrest.Matchers.containsString("mniu/example")))
                .andExpect(jsonPath("$.data.suggestions[1]").value(org.hamcrest.Matchers.containsString("src/main/java/App.java")));
        mvc.perform(post("/api/v1/reviews/repository")
                        .header(HttpHeaders.AUTHORIZATION, bearer(accessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"repositoryUrl\":\"https://github.com/mniu/too-large\",\"branch\":\"main\",\"language\":\"java\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("REPO_TOO_LARGE"));
        JsonNode reviews = getJsonWithToken("/api/v1/reviews", accessToken);
        String reviewId = reviews.at("/data/0/id").asText();
        mvc.perform(get("/api/v1/reviews/{reviewId}", reviewId)
                        .header(HttpHeaders.AUTHORIZATION, bearer(accessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(reviewId));

        mvc.perform(get("/api/v1/growth/me").header(HttpHeaders.AUTHORIZATION, bearer(accessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.xp").isNumber());
        mvc.perform(get("/api/v1/growth/achievements").header(HttpHeaders.AUTHORIZATION, bearer(accessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
        mvc.perform(get("/api/v1/growth/activities").header(HttpHeaders.AUTHORIZATION, bearer(accessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
        mvc.perform(get("/api/v1/notifications/unread-count").header(HttpHeaders.AUTHORIZATION, bearer(accessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.count").isNumber());
        mvc.perform(put("/api/v1/notifications/read-all").header(HttpHeaders.AUTHORIZATION, bearer(accessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.read").value(true));
        mvc.perform(get("/api/v1/notifications/unread-count").header(HttpHeaders.AUTHORIZATION, bearer(accessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.count").value(0));
    }

    @Test
    void frameworkErrorsUseUnifiedApiResponse() throws Exception {
        mvc.perform(get("/api/v1/auth/login"))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("METHOD_NOT_ALLOWED"));

        mvc.perform(get("/api/v1/auth/missing-route"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("NOT_FOUND"));
    }

    @Test
    void directBrowserSsePreflightAllowsConfiguredOrigin() throws Exception {
        mvc.perform(options("/api/v1/coach/sessions/1/messages/stream")
                        .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "authorization,content-type"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"));
    }

    private JsonNode postJson(String path, String json) throws Exception {
        String body = mvc.perform(post(path).contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(body);
    }

    private JsonNode postJsonWithToken(String path, String token, String json) throws Exception {
        String body = mvc.perform(post(path).header(HttpHeaders.AUTHORIZATION, bearer(token)).contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(body);
    }

    private JsonNode getJsonWithToken(String path, String token) throws Exception {
        String body = mvc.perform(get(path).header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(body);
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }
}
