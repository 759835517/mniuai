package com.mniu.aicamp.shared.security;

import com.mniu.aicamp.auth.application.AuthService;
import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.api.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, TokenAuthFilter tokenAuthFilter,
                                            ObjectMapper objectMapper, CorsConfigurationSource corsConfigurationSource) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .dispatcherTypeMatchers(DispatcherType.ASYNC, DispatcherType.ERROR, DispatcherType.FORWARD).permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/v1/auth/**", "/api/v1/landing/**", "/api/v1/public/**", "/api/v1/courses", "/api/v1/courses/*", "/api/v1/lessons/*", "/api/v1/articles", "/api/v1/articles/*", "/api/v1/campus/paths", "/api/v1/campus/paths/{slug}", "/api/v1/campus/courses/{courseId}/lessons", "/api/v1/campus/practice/problems", "/api/v1/campus/subscription/plans", "/api/v1/interview/questions", "/api/v1/interview/sets", "/api/v1/edu/lesson/generate", "/api/v1/edu/quiz/generate", "/api/v1/edu/slides/generate", "/api/v1/edu/grade/submit", "/api/v1/edu/templates/list", "/api/v1/pro/writing/generate", "/api/v1/pro/meeting/generate", "/api/v1/pro/data-analysis/query", "/api/v1/pro/resume/analyze", "/api/v1/pro/report/generate", "/api/v1/pro/assessment", "/api/v1/pro/templates", "/api/v1/engineer/assessment", "/api/v1/engineer/paths", "/api/v1/engineer/tasks", "/api/v1/engineer/tasks/{taskId}/submit", "/api/v1/engineer/algorithms", "/api/v1/engineer/algorithms/{problemId}/submit", "/api/v1/engineer/algorithms/{problemId}/hint", "/api/v1/engineer/interview/start", "/api/v1/engineer/interview/answer", "/api/v1/engineer/interview/{sessionId}/report", "/api/v1/engineer/code-review", "/api/v1/engineer/system-design/{topicId}", "/api/v1/engineer/guarantee/progress", "/api/v1/engineer/guarantee/apply", "/api/v1/kids/paths", "/api/v1/kids/paths/{slug}", "/api/v1/kids/competition/problems", "/api/v1/kids/competition/problems/{problemId}", "/api/v1/kids/badges", "/actuator/health", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(eh -> eh.authenticationEntryPoint((request, response, ex) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    objectMapper.writeValue(response.getWriter(), ApiResponse.error(ErrorCode.UNAUTHORIZED.name(), "Authentication required"));
                }))
                .addFilterBefore(tokenAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        // TODO: 从配置文件读取允许的 origins
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:3002",
                "http://localhost:3003",
                "http://localhost:3004",
                "http://localhost:3005",
                "http://localhost:5173"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

@Configuration
class TokenAuthFilter extends OncePerRequestFilter {
    private final AuthService authService;

    TokenAuthFilter(AuthService authService) {
        this.authService = authService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            authService.authenticate(header.substring(7)).ifPresent(user -> {
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        user, null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + user.role())));
                SecurityContextHolder.getContext().setAuthentication(auth);
            });
        }
        filterChain.doFilter(request, response);
    }
}
